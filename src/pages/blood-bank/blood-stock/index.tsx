import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { BloodUnit } from "@/lib/types";
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice";
import { AppDispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { formatFilters } from "@/util/query-builder";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UsageWastageStats } from "../usage-and-wastage/components/usage-and-wastage-stats";
import BloodStockTable from "./components/blood-stocks-table";
import { columns } from "./components/columns";

export default function BloodStockPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [search, setSearch] = useState<string>("");
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const debouncedValue = useDebounce(search, 3000);


  const stocks = useSelector(state => state.bloodPouch.data)
  const fetchLoading = useSelector(state => state.bloodPouch.fetchLoading)

  // Effect to handle filter changes
  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);

    const result = { ...formattedFilters.filter };


    const statusFilter: any = columnFilters.find(cF => cF.id === 'status')

    const or: any = []
    if (statusFilter?.id === 'status') {
      statusFilter?.value?.forEach((v: any) => {
        if (v === 'used') {
          or.push({ isUsed: true })
        }

        if (v === 'wasted') {
          or.push({ isWasted: true })

        }

        if (v === 'transferred') {
          or.push({
            bloodPouchRequests: {
              requestType: 'Transfer',
              status: 'Transfer'
            }
          })

        }

        if (v === 'approved') {
          or.push({
            bloodPouchRequests: {
              requestType: 'Transfer',
              status: 'Approve'
            }
          })

        }

        if (v === 'available') {
          or.push({
            isUsed: false,
            isWasted: false,
            bloodPouchRequests: {
              $or: [
                {
                  id: { $null: true }
                },
                {
                  $and: [{
                    requestType: 'Transfer'
                  },
                  {
                    status: {
                      $ne: 'Approve',
                    }
                  }]
                }
              ],
            }
          })
        }

        if (v === 'expiring_soon') {
          or.push({
            isUsed: false,
            isWasted: false,
            expiry: {
              $gt: new Date(), // Not expired yet
              $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expires within 7 days
            },
          })
        }
      })
    }


    delete result.status;



    if ('isTransferred' in formattedFilters.filter) {
      if (formattedFilters.filter.isTransferred === true) {
        result.bloodPouchRequests = {
          requestType: 'Transfer',
          status: 'Approve',
        };
      }
      else { //transfer no
        result.bloodPouchRequests = {
          $or: [
            {
              id: { $null: true }
            },
            {
              $and: [{
                requestType: 'Transfer'
              },
              {
                status: {
                  $ne: 'Approve',
                }
              }]
            }
          ],
        };
      }
    }

    delete result.isTransferred;
    // You can use formattedFilters here to make API calls

    dispatch(
      fetchBloodPouches({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: 'donor.donorProfile, bloodGroup, bloodPouchRequests',
          filters: {
            ...result,
            ...(or.length ? { $or: or } : {}),
            organizer: {
              id: user?.organizerProfile?.id,
            },
            ...(debouncedValue !== "" && {
              $or: [
                {
                  donor: {
                    donorProfile: {
                      donorId: {
                        $containsi: debouncedValue,
                      }
                    },
                  },
                },
                {
                  pouchId: {
                    $containsi: debouncedValue,
                  },
                }
              ],
            }),
          },
          ...(sorting?.[0]?.id
            ? {
              sort: [
                `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "desc" : "asc"}`,
              ],
            }
            : {
              sort: [
                'createdAt:desc',
              ],
            }),
        },
      })
    ).finally(() => {
      setIsSearchLoading(false); // Stop loading when API call completes
    });
  }, [
    columnFilters,
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    sorting,
    user?.organizerProfile?.id,
    debouncedValue,
  ]);


  // Memoize the data for the table to update properly when filters change
  const filteredData = useMemo(() => {
    return (stocks?.data?.map((d) => ({
      id: d.id,
      expiryDate: moment(d?.attributes?.expiry).format("DD MMM, YYYY"),
      donationDate: moment(d?.attributes?.donationDate).format("DD MMM, YYYY"),
      pouchId: d?.attributes?.pouchId,
      isTransferred: d?.attributes?.bloodPouchRequests?.data?.some((bP: any) => bP?.attributes?.status === 'Transfer' && bP?.attributes?.requestType === 'Transfer'),
      isApproved: d?.attributes?.bloodPouchRequests?.data?.some((bP: any) => bP?.attributes?.status === 'Approve' && bP?.attributes?.requestType === 'Transfer'),
      isUsed: d?.attributes?.isUsed,
      isWasted: d?.attributes?.isWasted,
      bloodType: d?.attributes?.bloodType,
      bloodGroup: d?.attributes?.bloodGroup?.data?.attributes?.name,
      status: 'Available',
      donorId: d?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes?.donorId,
      donor: d?.attributes?.donor?.data?.id,
      usageDate: moment(d?.attributes?.usedAt).format("DD MMM, YYYY"),
    })) ?? []) as BloodUnit[];
  }, [stocks]);


  devLog(filteredData, "filtered")


  const table = useReactTable<BloodUnit>({
    data: filteredData,
    manualPagination: true,
    pageCount: Math.ceil(filteredData?.length),
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const breadcrumbItems = [{ label: "Blood Stocks", href: "/blood-stocks" }];

  return (
    <div className="w-full space-y-4">
      <div className="mb-6">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>
      <div className="flex items-start justify-between gap-10">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Blood Stocks</h2>
            <span className="text-sm">
              Total records : {filteredData?.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search stocks by pouchID and donorID ..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setIsSearchLoading(true); // Start loading when typing or clearing
            }}
            className="w-full"
          />
          <Button onClick={() => navigate("/blood-stocks/add")}>Add Stock</Button>

        </div>

      </div>

      <div className="mt-6">
        <UsageWastageStats />
      </div>

      {fetchLoading || isSearchLoading ? (
        <Loader />
      ) : (
        <BloodStockTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}

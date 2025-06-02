import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { fetchDonors } from "@/store/features/donor-slice";
import { RootState } from "@/store/root-reducer";
import { AppDispatch } from "@/store/store";
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
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { columns, Donor } from "./components/columns";
import DonorTable from "./components/donors-table";

export default function DonorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const data = useSelector((state: RootState) => state.donor.data);
  const fetchLoading = useSelector(
    (state: RootState) => state.donor.fetchLoading
  );

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

  // Effect to handle filter changes
  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);
    // You can use formattedFilters here to make API calls

    dispatch(
      fetchDonors({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          filters: {
            ...formattedFilters.filter,
            organizer: {
              id: user?.organizerProfile?.id,
            },
            ...(debouncedValue !== "" && {
              $or: [
                {
                  donor: {
                    username: {
                      $containsi: debouncedValue,
                    },
                  },
                },
                {
                  donor: {
                    donorProfile: {
                      donorId: {
                        $containsi: debouncedValue
                      },
                    },
                  },
                },
                {
                  donor: {
                    email: {
                      $containsi: debouncedValue,
                    },
                  },
                },
                {
                  donor: {
                    phone: {
                      $containsi: debouncedValue,
                    },
                  },
                },
              ],
            }),
          },
          populate: "donor.donorProfile, donor.bloodGroup",
          ...(sorting?.[0]?.id
            ? {
              sort: [
                `${sorting?.[0]?.id}:${sorting?.[0]?.desc ? "desc" : "asc"}`,
              ],
            }
            : {}),
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
    return (data?.data?.map((d) => ({
      id: d?.attributes?.donor?.data?.id,
      donor_id: d?.id,
      donorId: d?.attributes?.donor?.data?.attributes?.donorProfile?.data?.attributes?.donorId,
      username: d?.attributes?.donor?.data?.attributes?.username,
      email: d?.attributes?.donor?.data?.attributes?.email,
      phone: d?.attributes?.donor?.data?.attributes?.phone,
      dob: d?.attributes?.donor?.data?.attributes?.dob,
      gender: d?.attributes?.donor?.data?.attributes?.gender,
      bloodGroup: d?.attributes?.donor?.data?.attributes?.bloodGroup?.data?.attributes?.name,
      createdAt: moment(d?.attributes?.createdAt).format("MMM DD, YYYY"),
    })) ?? []) as Donor[];
  }, [data]);


  const table = useReactTable<Donor>({
    data: filteredData,
    pageCount: Math.ceil(data?.meta?.pagination?.total || 0),
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const breadcrumbItems = [{ label: "Donors", href: "/donors" }];

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
            <h2 className="text-3xl font-bold tracking-tight">Donors</h2>
            <span className="text-sm">
              Total records : {data?.meta?.pagination?.total}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search donors by donorId, username, phone and email ..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setIsSearchLoading(true); // Start loading when typing or clearing
            }}
            className="w-full"
          />
          <Button onClick={() => navigate("/donors/add")}>Add Donor</Button>
        </div>
      </div>

      {fetchLoading || isSearchLoading ? (
        <Loader />
      ) : (
        <DonorTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}

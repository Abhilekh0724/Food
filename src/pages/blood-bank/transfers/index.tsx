import DashboardBreadcrumb from "@/components/common/breadcrumb";
import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Removed TabsContent since we don't need separate content
import { useAuth } from "@/context/auth-context";
import useDebounce from "@/hooks/useDebounce";
import { BloodTransferI } from "@/lib/types";
import { fetchBloodTransfers, fetchBloodTransfersMeta } from "@/store/features/blood-transfer-slice";
import { AppDispatch, useSelector } from "@/store/store";
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
import { ChevronLeft, Droplet } from "lucide-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import BloodTransferTable from "./components/blood-transfers-table";
import { columns } from "./components/columns";

export default function BloodTransfersPage() {
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
  const [tab, setTab] = useState<"incoming" | "outgoing">("outgoing");
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const debouncedValue = useDebounce(search, 3000);

  const transfers = useSelector(state => state.bloodTransfer.data)
  const stats = useSelector(state => state.bloodTransfer.stats)
  const fetchLoading = useSelector(state => state.bloodTransfer.fetchLoading)

  // Effect to handle filter changes (same as before)
  //
  useEffect(() => {
    dispatch(fetchBloodTransfersMeta({ id: user?.organizerProfile?.id }))
  }, [dispatch, user?.organizerProfile?.id])


  useEffect(() => {
    const formattedFilters = formatFilters(columnFilters);

    const tabFilter = tab === "incoming"
      ? { toOrganizer: user?.organizerProfile?.id }
      : { fromOrganizer: user?.organizerProfile?.id };

    dispatch(
      fetchBloodTransfers({
        params: {
          pagination: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
          },
          populate: 'toOrganizer, fromOrganizer, requestedBloodPouches.bloodGroup, bloodGroup',
          filters: {
            ...formattedFilters.filter,
            ...tabFilter,
            ...(debouncedValue !== "" && {
              $or: [
                {
                  toOrganizer: {
                    name: {
                      $containsi: debouncedValue,
                    },
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
                `createdAt:desc`,
              ]
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
    tab,
  ]);

  // Memoize the data (same as before)
  const filteredData = useMemo(() => {
    return (transfers?.data?.map((d) => ({
      id: d.id,
      unitId: d?.attributes,
      requestedDate: moment(d?.attributes?.createdAt).format("DD MMM, YYYY"),
      donationDate: moment(d?.attributes?.donationDate).format("DD MMM, YYYY"),
      requester: d?.attributes?.fromOrganizer?.data,
      status: d?.attributes?.status,
      purpose: d?.attributes?.purpose,
      bloodType: d?.attributes?.bloodType,
      noOfUnits: d?.attributes?.noOfUnits,
      bloodGroup: d?.attributes?.bloodGroup?.data?.attributes?.name,
      tab,
      message: d?.attributes?.statusMessage,
      donor: d?.attributes?.donor?.data?.id,
      usageDate: moment(d?.attributes?.usedAt).format("DD MMM, YYYY"),
    })) ?? []) as BloodTransferI[];
  }, [transfers, tab]);

  const table = useReactTable<BloodTransferI>({
    data: filteredData,
    manualPagination: true,
    pageCount: Math.ceil(filteredData?.length),
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const breadcrumbItems = [{ label: "Blood Transfers", href: "/blood-transfers" }];

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
            <h2 className="text-3xl font-bold tracking-tight">Blood Transfers</h2>
            <span className="text-sm">
              Total records : {filteredData?.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-1">
          <Input
            placeholder="Search by Blood Bank ..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setIsSearchLoading(true); // Start loading when typing or clearing
            }}
            className="w-full"
          />
          <Button onClick={() => navigate("/blood-transfers/add")}>Request Blood Transfer</Button>
        </div>
      </div>

      <div className="flex gap-5 py-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Incoming Transfer Requests Count</CardTitle>
            <Droplet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">
              {stats?.totalIncomingBloodTransfersCount || 0}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Outgoing Transfer Requests Count</CardTitle>
            <Droplet className="h-4 w-4 text-amber-600" />
          </CardHeader>

          <CardContent>
            <span className="text-2xl font-bold">
              {stats?.totalOutgoingBloodTransfersCount || 0}
            </span>
          </CardContent>

        </Card>
      </div>
      {/* Compact Tabs implementation */}
      <div className="flex items-center justify-between gap-4">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as "incoming" | "outgoing");
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
          }}
          className="w-auto"
        >
          <TabsList className="h-10">
            <TabsTrigger value="incoming" className="px-4 py-1 text-sm">
              Incoming Transfer Requests
            </TabsTrigger>
            <TabsTrigger value="outgoing" className="px-4 py-1 text-sm">
              Outgoing Transfer Requests
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Optional: Add a small indicator showing which tab is active */}
        <span className="text-sm text-muted-foreground">
          Showing {tab === "incoming" ? "incoming" : "outgoing"} transfers
        </span>
      </div>

      {/* Single table instance that changes based on tab selection */}
      {fetchLoading || isSearchLoading ? (
        <Loader />
      ) : (
        <BloodTransferTable
          pagination={pagination}
          setPagination={setPagination}
          table={table}
        />
      )}
    </div>
  );
}

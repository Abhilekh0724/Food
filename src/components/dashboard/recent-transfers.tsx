import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dispatch, useSelector } from "@/store/store"
import { useEffect } from "react"
import { fetchBloodTransfers } from "@/store/features/blood-transfer-slice"
import { Link } from "react-router-dom"
import moment from "moment"
import { useAuth } from "@/context/auth-context"


export function RecentTransfers() {
  const { user } = useAuth()

  const transfers = useSelector(state => state.bloodTransfer.data)

  useEffect(() => {
    dispatch(
      fetchBloodTransfers({
        params: {
          pagination: {
            page: 1,
            pageSize: 10,
          },
          populate: 'toOrganizer, fromOrganizer, requestedBloodPouches.bloodGroup, bloodGroup',
          filters: {
            toOrganizer: user?.organizerProfile?.id
          },
          sort: [
            `createdAt:desc`,
          ]
        },
      })
    );
  }, [user?.organizerProfile?.id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incoming Transfers</CardTitle>
        <CardDescription>Blood transfers to and from other facilities</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Requested Date</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers?.data?.map((transfer) => {
              const status = transfer?.attributes?.status?.toLowerCase();
              let bgColor = "";
              let textColor = "";

              switch (status) {
                case "pending":
                  bgColor = "bg-yellow-100";
                  textColor = "text-yellow-800";
                  break;
                case "approve":
                  bgColor = "bg-indigo-100";
                  textColor = "text-indigo-800";
                  break;
                case "reject":
                  bgColor = "bg-red-100";
                  textColor = "text-red-800";
                  break;
                case "transfer":
                  bgColor = "bg-purple-100";
                  textColor = "text-purple-800";
                  break;
                default:
                  bgColor = "bg-gray-100";
                  textColor = "text-gray-800";
              }
              return <TableRow key={transfer?.id}>
                <TableCell className="font-medium underline"><Link to={`/blood-transfers/${transfer?.id}`}>
                  {transfer?.id}
                </Link></TableCell>
                <TableCell>{moment(transfer?.attributes?.createdAt)?.format("DD MMM, YYYY | HH:mm A")}</TableCell>
                <TableCell>{transfer?.attributes?.fromOrganizer?.data?.attributes?.name}</TableCell>
                <TableCell>{transfer?.attributes?.bloodType}</TableCell>
                <TableCell>{transfer?.attributes?.bloodGroup?.data?.attributes?.name}</TableCell>
                <TableCell>{transfer?.attributes?.noOfUnits}</TableCell>
                <TableCell>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} text-center`}>
                    {transfer?.attributes?.status === 'Approve' ? "Approved" : transfer?.attributes?.status === 'Transfer' ? "Transferred" : transfer?.attributes?.status === 'Reject' ? "Rejected" : transfer?.attributes?.status === 'Cancel' ? "Cancelled" : transfer?.attributes?.status}
                  </div>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

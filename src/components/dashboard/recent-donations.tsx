import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { dispatch, useSelector } from "@/store/store"
import { fetchBloodPouches } from "@/store/features/blood-pouch-slice"
import { useAuth } from "@/context/auth-context"
import moment from "moment"
import { Link } from "react-router-dom"


export function RecentDonations() {
  const { user } = useAuth()
  const stocks = useSelector(state => state.bloodPouch.data)


  useEffect(() => {
    dispatch(
      fetchBloodPouches({
        params: {
          pagination: {
            page: 1,
            pageSize: 5,
          },
          populate: 'donor.donorProfile, bloodGroup, bloodPouchRequests',
          filters: {
            organizer: {
              id: user?.organizerProfile?.id,
            },
          },
          sort: [
            'createdAt:desc',
          ],
        },
      })
    );
  }, [user?.organizerProfile?.id])


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Donations</CardTitle>
        <CardDescription>Latest blood donations received</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pouch ID</TableHead>
              <TableHead>Donor</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks?.data?.map((donation) => (
              <TableRow key={donation.id}>
                <TableCell className="font-medium underline">
                  <Link to={`blood-stocks/${donation?.id}`}>
                    {donation?.attributes?.pouchId}
                  </Link>
                </TableCell>
                <TableCell>{donation?.attributes?.donor?.data?.attributes?.firstName} {donation?.attributes?.donor?.data?.attributes?.lastName}</TableCell>
                <TableCell>{donation?.attributes?.bloodType}</TableCell>
                <TableCell>{donation?.attributes?.bloodGroup?.data?.attributes?.name}</TableCell>
                <TableCell>{moment(donation?.attributes?.createdAt)?.format("DD MMM, YYYY | HH:mm A")}</TableCell>
                <TableCell>
                  {donation?.attributes?.isUsed ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      Used
                    </span>
                  ) : donation?.attributes?.isWasted ? (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-red-900 dark:text-red-300">
                      Wasted
                    </span>
                  ) : donation?.attributes?.bloodPouchRequests?.data?.some((bP: any) => bP?.attributes?.status === 'Approve' && bP?.attributes?.requestType === 'Transfer') ? (
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-purple-900 dark:text-purple-300">
                      Approved
                    </span>
                  ) : donation?.attributes?.bloodPouchRequests?.data?.some((bP: any) => bP?.attributes?.status === 'Transfer' && bP?.attributes?.requestType === 'Transfer') ? <span className="bg-purple-100 text-purple-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                    Transferred
                  </span> : <span className="bg-green-100 text-green-800 text-xs font-medium px-4 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
                    Available
                  </span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

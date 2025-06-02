import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingDown } from "lucide-react"
import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { fetchAlertBloodPouches } from "@/store/features/blood-pouch-slice"
import { dispatch, useSelector } from "@/store/store"
import moment from "moment"

const alerts = [
  {
    type: "Low Stock",
    bloodType: "O-",
    message: "Only 5 units remaining",
    severity: "high",
    icon: TrendingDown,
  },
  {
    type: "Low Stock",
    bloodType: "AB-",
    message: "Only 3 units remaining",
    severity: "high",
    icon: TrendingDown,
  },
  {
    type: "Expiring Soon",
    bloodType: "B+",
    message: "10 units expiring in 3 days",
    severity: "medium",
    icon: AlertTriangle,
  },
  {
    type: "Expiring Soon",
    bloodType: "A+",
    message: "5 units expiring in 5 days",
    severity: "medium",
    icon: AlertTriangle,
  },
]

export function StockAlerts() {

  const { user } = useAuth()
  const alertStocks = useSelector(state => state.bloodPouch.alertStocks)


  useEffect(() => {
    dispatch(
      fetchAlertBloodPouches({
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
            expiry: {
              $gt: new Date(), // Not expired yet
              $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Expires within 7 days
            }
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
        <CardTitle>Stock Alerts</CardTitle>
        <CardDescription>Critical alerts for blood stock</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertStocks?.data?.map((alert, index) => (
            <div key={index} className="flex items-start gap-4 rounded-lg border p-3">
              <div className={`rounded-full p-1 bg-red-100`}>
                <AlertTriangle className={`h-4 w-4 text-red-600`} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{alert?.attributes?.bloodGroup?.data?.attributes?.name}</Badge>
                  <Badge variant="outline">Expiring Soon.</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Donation Date: {moment(alert?.attributes?.createdAt).format("DD MMM, YYYY | HH:mm A")}</p>
                  <p className="text-sm text-muted-foreground">Expiry Date: {moment(alert?.attributes?.expiry).format("DD MMM, YYYY | HH:mm A")}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { fetchBloodPouches, fetchBloodPouchStats } from "@/store/features/blood-pouch-slice";
import { dispatch, useSelector } from "@/store/store";
import { BarChart, CheckCircle, Droplet, XCircle } from "lucide-react";
import { useEffect } from "react";

export function UsageWastageStats() {

  const { user } = useAuth()


  const bloodPouchStats = useSelector(state => state.bloodPouch.stats)
  // TODO: fetch the total blood pouches

  useEffect(() => {
    dispatch(fetchBloodPouchStats({
      params: {
        pagination: {
          pageSize: 1,
          page: 1,
        },
      },
      id: user?.organizerProfile?.id
    }))
  }, [user?.organizerProfile?.id])


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Available Pouches
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bloodPouchStats?.totalAvailableBloodPouches}</div>
          {/* <p className="text-xs text-muted-foreground">Last 30 days</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pouches Used</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bloodPouchStats?.totalBloodPouchesUsed}</div>
          {/* <p className="text-xs text-muted-foreground">Last 30 days</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Pouches Wasted</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bloodPouchStats?.totalBloodPouchesWasted}</div>
          {/* <p className="text-xs text-muted-foreground">Last 30 days</p> */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <Droplet className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bloodPouchStats?.totalExpiringBloodPouches}</div>
          <p className="text-xs text-muted-foreground">Expiring within 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}

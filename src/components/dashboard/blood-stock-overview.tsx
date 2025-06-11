import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSelector, useDispatch } from "@/store/store";
import { Droplet } from "lucide-react"
import { useEffect } from "react";
import { getBloodBankDashboardStats } from "@/store/features/dashboard-slice";

export function BloodStockOverview() {
  const dispatch = useDispatch();
  const stats = useSelector((state) => state.dashboard.bloodBankStats);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.organizerProfile?.id) {
      dispatch(getBloodBankDashboardStats({ user }));
    }
  }, [dispatch, user]);

  if (!user?.organizerProfile?.id) {
    return null;
  }

  return (
    <>
      {stats?.map((blood: any) => (
        <Card key={blood.type}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Blood Type {blood.type}</CardTitle>
            <Droplet className={`h-4 w-4 text-red-600`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blood?.count}</div>
            <p className="text-xs text-muted-foreground">Available Units</p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className={`h-2 rounded-full ${blood?.color}`}
                style={{ width: `${Math.min(100, (blood?.count / 100) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

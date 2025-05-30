import { useSelector } from "@/store/store";

export function RecentSales() {
  const stats = useSelector((state) => state.dashboard.stats);

  return (
    <div className="space-y-8">
      {stats?.recentEnrollments?.map((enrollment: any, index: number) => (
        <div key={index} className="flex items-center">
          <div className="ml-4 space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">
              {enrollment?.fullName}
            </p>
            <p className="text-sm text-muted-foreground">{enrollment?.email}</p>
            <p className="text-sm text-muted-foreground">{enrollment?.mobile}</p>
          </div>
          <div className="ml-auto flex-1 font-medium">
            {enrollment?.course?.name}
          </div>
        </div>
      ))}
    </div>
  );
}

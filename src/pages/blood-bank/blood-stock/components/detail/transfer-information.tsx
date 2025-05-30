import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { CheckCircle, Truck } from "lucide-react";
import moment from "moment";

export default function TransferInformation() {
  const singleBloodUnit = useSelector(state => state.bloodPouch.singleData);
  devLog(singleBloodUnit?.attributes?.bloodPouchRequests?.data?.length, "HELLO WORLD")


  return (
    <div className="space-y-4">
      {singleBloodUnit?.attributes?.bloodPouchRequests?.data?.length ? <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Transfer History
          </CardTitle>
          <CardDescription>Complete history of blood unit transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {singleBloodUnit?.attributes?.bloodPouchRequests?.data?.map((transfer: any, index: number) => {
              const status = transfer?.attributes?.status?.toLowerCase();
              let bgColor = "";
              let textColor = "";

              switch (status) {
                case "pending":
                  bgColor = "bg-yellow-100";
                  textColor = "text-yellow-800";
                  break;
                case "approve":
                  bgColor = "bg-green-100";
                  textColor = "text-green-800";
                  break;
                case "reject":
                  bgColor = "bg-red-100";
                  textColor = "text-red-800";
                  break;
                default:
                  bgColor = "bg-gray-100";
                  textColor = "text-gray-800";
              }
              return <div key={transfer.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{transfer?.id}</Badge>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} text-center`}>
                      {transfer?.attributes?.status}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {transfer?.attributes?.transferAt ? `${moment(transfer?.attributes?.transferAt).format("DD MMM, YYYY")} at   {moment(transfer?.attributes?.transferAt).format("HH:mm A")}` : ''}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">From:</span> {transfer?.attributes?.fromOrganizer?.data?.attributes?.name}
                  </div>
                  <div>
                    <span className="font-medium">To:</span> {transfer?.attributes?.toOrganizer?.data?.attributes?.name}
                  </div>

                  <div className="col-span-2">
                    <span className="font-medium">Reason:</span> {transfer?.attributes?.purpose}
                  </div>
                </div>
              </div>
            })}
          </div>
        </CardContent>
      </Card> : <div className="flex justify-center">No Transfer History</div>}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import moment from "moment";

export default function PouchesInformation() {

  const singleTransfer = useSelector(state => state.bloodTransfer.singleData)

  devLog(singleTransfer, "single transsdfre")
  return <Card>
    <CardHeader>
      <CardTitle>Requested Blood Pouches</CardTitle>
      <CardDescription>
        {singleTransfer?.attributes?.requestedBloodPouches?.data?.length || 0} pouches included in this transfer
      </CardDescription>
    </CardHeader>
    <CardContent>
      {singleTransfer?.attributes?.requestedBloodPouches?.data?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pouch ID</TableHead>
              <TableHead>Blood Type</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Expiry Date</TableHead>
              {/* <TableHead>Status</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {singleTransfer?.attributes?.requestedBloodPouches?.data?.map((pouch: any) => (
              <TableRow key={pouch?.id}>
                <TableCell>{pouch?.attributes?.pouchId}</TableCell>
                <TableCell>{pouch?.attributes?.bloodType}</TableCell>
                <TableCell>{pouch?.attributes?.bloodGroup?.data?.attributes?.name}</TableCell>
                <TableCell>
                  {moment(pouch?.attributes?.expiry).format("DD MMM, YYYY")}
                </TableCell>
                {/* <TableCell>
                  {pouch?.attributes?.isUsed ? (
                    <Badge variant="default">Used</Badge>
                  ) : pouch?.attributes?.isWasted ? (
                    <Badge variant="destructive">Wasted</Badge>
                  ) : (
                    <Badge variant="secondary">Available</Badge>
                  )}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No blood pouches included in this transfer
        </div>
      )}
    </CardContent>
  </Card>
}

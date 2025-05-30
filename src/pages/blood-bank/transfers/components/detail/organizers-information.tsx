import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelector } from "@/store/store";

export default function OrganizerDetail() {

  const singleTransfer = useSelector(state => state.bloodTransfer.singleData)

  return <Card>
    <CardHeader>
      <CardTitle>Organizers Involved</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="font-medium mb-2">From Organizer</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Name:</span>{' '}
            {singleTransfer?.attributes?.fromOrganizer?.data?.attributes?.name}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Type:</span>{' '}
            {singleTransfer?.attributes?.fromOrganizer?.data?.attributes?.type}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Phone:</span>{' '}
            {singleTransfer?.attributes?.fromOrganizer?.data?.attributes?.phoneNumber}
          </p>
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2">To Organizer</h3>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Name:</span>{' '}
            {singleTransfer?.attributes?.toOrganizer?.data?.attributes?.name}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Type:</span>{' '}
            {singleTransfer?.attributes?.toOrganizer?.data?.attributes?.type}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">Phone:</span>{' '}
            {singleTransfer?.attributes?.toOrganizer?.data?.attributes?.phoneNumber}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
}

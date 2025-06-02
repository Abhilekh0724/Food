import { devLog } from "@/util/logger";
import { Calendar, MapPin, Users } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function EventCard({ event, tab }: { event: Record<any, any>, tab: 'unverified' | "verified" | 'all' | 'upcoming' | 'completed' | 'active' }) {
  return <Card className="overflow-hidden">
    <div className="h-[140px] overflow-hidden">
      <img
        src={event?.attributes?.featureImage?.data?.attributes?.url || "/placeholder.svg"}
        alt={event?.attributes?.name}
        className="w-full h-full object-cover"
      />
    </div>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">{event?.attributes?.name}</CardTitle>
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{tab?.charAt(0)?.toUpperCase() + tab?.slice(1).toLowerCase()}</Badge>
      </div>
      <CardDescription>{event?.attributes?.description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-4">
      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {moment(event?.attributes?.eventDateTime)?.format("DD MMM, YYYY | HH:mm A")}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{event?.attributes?.address?.district}</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {event?.attributes?.noOfParticipants} participants
          </span>
        </div>
        <div className="flex items-center mt-2 gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{ width: `${(event?.attributes?.eventJoiners?.data?.length / event?.attributes?.noOfParticipants) * 100}%` }}
            ></div>
          </div>
          <div className="flex-1">
            {((event?.attributes?.eventJoiners?.data?.length / event?.attributes?.noOfParticipants) * 100).toFixed(0)}%
          </div>
        </div>
        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/community/events/${event?.id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
}

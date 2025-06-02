import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { dispatch, useSelector } from "@/store/store"
import { fetchEvents } from "@/store/features/event-slice"
import { useAuth } from "@/context/auth-context"
import Loader from "@/components/common/loader"
import useDebounce from "@/hooks/useDebounce"
import { devLog } from "@/util/logger"
import EventCard from "@/components/cards/event-card"
import { useNavigate } from "react-router-dom"

export default function EventsPage() {

  const { user } = useAuth()
  const navigate = useNavigate()


  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9
  })

  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string>("desc");
  const [tab, setTab] = useState<'unverified' | "verified" | 'all' | 'upcoming' | 'completed' | 'active'>("upcoming");

  const debouncedValue = useDebounce(search, 3000);


  const events = useSelector(state => state.event.data)
  const fetchLoading = useSelector(state => state.event.fetchLoading)

  //TODO: fetch the events of the particular organizer

  useEffect(() => {
    function switchTabFilter(value: 'unverified' | "verified" | 'all' | 'upcoming' | 'completed' | 'active') {
      switch (value) {
        case 'upcoming':
          return {
            eventDateTime: {
              $gt: new Date()
            }
          }

        case 'active':
          return {
            eventDateTime: {
              $eq: new Date()
            }
          }

        case 'verified':
          return {
            status: {
              $eq: 'Verified'
            }
          }

        case 'unverified':
          return {
            status: {
              $eq: 'Pending'
            }
          }

        case 'completed':
          return {
            $and: [{
              status: {
                $eq: 'Verified'
              }
            }, {
              eventDateTime: {
                $lt: new Date()
              }
            }]
          }
        default:
          return {}
      }
    }


    dispatch(fetchEvents({
      params: {
        pagination,
        filters: {
          ...switchTabFilter(tab),
          organizer: {
            id: user?.organizerProfile?.id
          },
          ...(debouncedValue !== "" && {
            $or: [
              {
                name: {
                  $containsi: debouncedValue,
                },
              },
              {
                description: {
                  $containsi: debouncedValue,
                },
              },

              {
                address: {
                  country: {
                    $containsi: debouncedValue,
                  },
                }
              },

              {
                address: {
                  district: {
                    $containsi: debouncedValue,
                  },
                }
              },

              {
                address: {
                  municipality: {
                    $containsi: debouncedValue,
                  },
                }
              },


              {
                address: {
                  streetAddress: {
                    $containsi: debouncedValue,
                  },
                }
              },

              {
                address: {
                  city: {
                    $containsi: debouncedValue,
                  },
                }
              },
            ],
          }),
        },
        sort: [`createdAt:${sort}`],
        populate: '*'
      }

    }))
  }, [pagination, user?.organizerProfile?.id, debouncedValue, sort, tab])



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events List</h1>
        </div>
        <Button onClick={() => navigate(`/community/events/add`)} className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <Tabs onValueChange={(e) => {
        setTab(e as "unverified" | "verified" | "all" | "upcoming" | "completed" | "active")
        setPagination(prev => ({ ...prev, page: 1 }))
      }} defaultValue="upcoming">
        <TabsList onChange={(e) => devLog(e, "eeeeeeee")}>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="unverified">Unverified</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Events</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="upcoming" className="space-y-4"> */}
        <Card className="mt-5">
          <CardHeader>
            <div>
              <strong>{events?.meta?.pagination?.total}</strong> events
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search events by title or description or location..." className="pl-8" />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="desc" onValueChange={(e) => setSort(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Date (Newest First)</SelectItem>
                      <SelectItem value="asc">Date (Oldest First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value={tab} className="space-y-4">
                {fetchLoading ? <Loader /> : <>
                  {events?.data?.length ? <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {
                        events?.data?.map((event, index: number) => (
                          <EventCard tab={tab} event={event} key={index} />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {/* Showing <strong>{events?.meta?.pagination?.page}-6</strong> of  */}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => {
                            setPagination(prev => ({ ...prev, page: prev.page - 1 }))
                          }}
                          variant="outline" size="sm" disabled={pagination.page === 1}>
                          Previous
                        </Button>
                        <Button
                          onClick={() => {
                            setPagination(prev => ({ ...prev, page: prev.page + 1 }))
                          }}
                          variant="outline" size="sm" disabled={pagination.page === events?.meta?.pagination?.pageCount}>
                          Next
                        </Button>
                      </div>
                    </div>
                  </> : <div className="flex justify-center">No Events</div>}
                </>}
              </TabsContent>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div >
  )
}

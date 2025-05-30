import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "react-router-dom"
import QRCode from "@/components/qr-code"
import DashboardBreadcrumb from "@/components/common/breadcrumb"
import { useEffect } from "react"
import { dispatch, useSelector } from "@/store/store"
import { fetchSingleBloodPouches } from "@/store/features/blood-pouch-slice"
import Loader from "@/components/common/loader"
import UnitInformation from "./components/detail/unit-information"
import DonorInformation from "./components/detail/donor-information"
import UsageInformation from "./components/detail/usage-information"
import moment from "moment"
import TransferInformation from "./components/detail/transfer-information"



export default function BloodUnitDetailPage() {
  const { id } = useParams()



  const singleBloodUnit = useSelector(state => state.bloodPouch.singleData)
  const fetchLoading = useSelector(state => state.bloodPouch.fetchLoading)

  //get single blood unit detail
  useEffect(() => {
    dispatch(fetchSingleBloodPouches({
      params: {
        populate: 'donor.donorProfile.bloodGroup,bloodGroup,bloodPouchRequests.fromOrganizer,bloodPouchRequests.toOrganizer,donor.currentAddress,usedBy'
      },
      id
    }))
  }, [id])


  const breadcrumbItems = [
    { label: "Blood Stocks", href: "/blood-stocks" },
    { label: "Blood Unit Detail Page", href: `/blood-stocks/${id}` }
  ];


  return (
    <div className="space-y-6">
      <div className="mb-6">
        <DashboardBreadcrumb items={breadcrumbItems} homeHref="/" />
      </div>
      {fetchLoading ? <Loader /> : <>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blood Unit Details</h1>
          <p className="text-muted-foreground">Unit ID: {singleBloodUnit?.attributes?.pouchId}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <UnitInformation />

            <Tabs defaultValue="donor" className="space-y-4">
              <TabsList>
                <TabsTrigger value="donor">Donor Information</TabsTrigger>
                <TabsTrigger value="usage">Usage Details</TabsTrigger>
                <TabsTrigger value="transfers">Transfer History</TabsTrigger>
                <TabsTrigger value="wastage">Wastage Information</TabsTrigger>
              </TabsList>

              <TabsContent value="donor">
                <DonorInformation />
              </TabsContent>

              <TabsContent value="usage">
                <UsageInformation />
              </TabsContent>

              <TabsContent value="transfers">
                <TransferInformation />
              </TabsContent>

              <TabsContent value="wastage">
                {singleBloodUnit?.attributes?.wastedAt ? <Card>
                  <CardHeader>
                    <CardTitle>Wastage</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Wasted At</label>
                      <p className="font-medium mt-1">{moment(singleBloodUnit?.attributes?.wastedAt)?.format("DD MMM, YYYY")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Wastage Reason</label>
                      <p className="font-medium mt-1">{singleBloodUnit?.attributes?.wastedMessage}</p>
                    </div>
                  </CardContent>
                </Card> : <div className="flex justify-center w-full">No Wastage Information</div>}
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
                <CardDescription>Scan to access blood unit information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <QRCode value={`blood-unit:${singleBloodUnit?.attributes?.pouchId}`} size={200} />
                <p className="text-sm text-center text-muted-foreground">Unit ID: {singleBloodUnit?.attributes?.pouchId}</p>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Update Status
                </Button>
                <Button className="w-full" variant="outline">
                  Transfer Unit
                </Button>
                <Button className="w-full" variant="outline">
                  Print Label
                </Button>
                <Button className="w-full" variant="outline">
                  Download Report
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </>}
    </div>
  )
}

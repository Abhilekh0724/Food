import { useAuth } from "@/context/auth-context";
import { fetchBloodRequests } from "@/store/features/blood-request-slice";
import { dispatch, useSelector } from "@/store/store";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function RecentBloodRequests() {
  const { user } = useAuth();
  const bloodRequests = useSelector((state) => state.bloodRequest.data);

  useEffect(() => {
    dispatch(
      fetchBloodRequests({
        params: {
          pagination: {
            page: 1,
            pageSize: 5,
          },
          populate: "requestedBy,requestedBloodGroup",
          filters: {
            district: {
              $in: user?.organizerProfile?.workingDistricts
                ?.split(",")
                ?.map((district) => district),
            },
          },
          sort: ["createdAt:desc"],
        },
      })
    );
  }, [user]);

  // Function to format dates
  const formatDate = (dateString: any) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {bloodRequests?.data?.map((bloodRequest, index) => (
        <Link to={`blood-requests/${bloodRequest?.id}`}
          key={index}
          className="border block rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow duration-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Information */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Patient Information
              </h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Name:</span>{" "}
                {bloodRequest?.attributes?.patientName}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Age:</span>{" "}
                {bloodRequest?.attributes?.patientAge}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Gender:</span>{" "}
                {bloodRequest?.attributes?.patientGender}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Blood Type:</span>{" "}
                {bloodRequest?.attributes?.bloodType || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Blood Group:</span>{" "}
                {bloodRequest?.attributes?.requestedBloodGroup?.data?.attributes?.name || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Hospital:</span>{" "}
                {bloodRequest?.attributes?.hospital}
              </div>
            </div>

            {/* Requester Information and Request Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1">
                Request Details
              </h3>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Requested By:</span>{" "}
                {bloodRequest?.attributes?.requestedBy?.data?.attributes?.username || "N/A"}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Urgency:</span>{" "}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bloodRequest?.attributes?.urgency === "urgent"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                    }`}
                >
                  {bloodRequest?.attributes?.urgency}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bloodRequest?.attributes?.isFulfilled
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {bloodRequest?.attributes?.isFulfilled ? "Fulfilled" : "Pending"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Needed Before:</span>{" "}
                {formatDate(bloodRequest?.attributes?.needBefore)}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Requested On:</span>{" "}
                {formatDate(bloodRequest?.attributes?.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

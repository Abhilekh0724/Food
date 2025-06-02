import Loader from "@/components/common/loader";
import { fetchSingleFollowers } from "@/store/features/follower-slice";
import { dispatch, useSelector } from "@/store/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BloodDonorProfile from "./donor-profile";

const ProfileDetailPage = () => {
  const { id } = useParams();

  const user = useSelector((state) => state.follower.singleData);
  const fetchLoading = useSelector((state) => state.follower.fetchLoading);

  useEffect(() => {
    dispatch(
      fetchSingleFollowers({
        id,
        params: {
          populate: "*",
        },
      })
    );
  }, [id]);

  return <>
    {fetchLoading ? <Loader /> : <BloodDonorProfile data={user} />}
  </>;
};

export default ProfileDetailPage;

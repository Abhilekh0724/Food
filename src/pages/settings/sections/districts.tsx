import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/context/auth-context";
import { districts } from "@/data/districts";
import { updateOrganizerProfile } from "@/store/features/auth-slice";
import { dispatch, useSelector } from "@/store/store";
import { devLog } from "@/util/logger";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function DistrictSelect() {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const { user } = useAuth();

  const handleUpdate = () => {
    const data = { data: { workingDistricts: selectedDistricts.join(",") } };
    dispatch(updateOrganizerProfile({ data, id: user?.organizerProfile?.id }));
  };

  return (
    <div>
      <MultiSelect
        options={districts}
        onValueChange={setSelectedDistricts}
        defaultValue={
          user?.organizerProfile?.workingDistricts !== ""
            ? user?.organizerProfile?.workingDistricts?.split(",")
            : []
        }
        placeholder="Select district"
        variant="inverted"
        animation={2}
        maxCount={districts.length}
      />

      <Button
        onClick={handleUpdate}
        className="mt-4"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update
      </Button>
    </div>
  );
}

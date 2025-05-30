import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center gap-5">
      <Loader2 className="animate-spin" />
      Loading...
    </div>
  );
};

export default Loader;

import { Loader2 } from "lucide-react";

const Loader = ({ message = "Fetching" }: { message?: string }) => {
  return (
    <div className="flex justify-center items-center gap-5 absolute inset-0">
      <Loader2 className="animate-spin text-primary" />
      {message}...
    </div>
  );
};

export default Loader;

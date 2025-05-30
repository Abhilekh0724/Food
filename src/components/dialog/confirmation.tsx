import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import React from "react";

export function ConfirmDialog({
  title,
  onOk,
  onClose,
  loading,
  description
}: {
  title: string;
  loading: boolean | undefined;
  onOk: () => void;
  onClose?: () => void;
  description?: React.ReactNode
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {description}
      <DialogFooter>
        <Button disabled={loading} onClick={onOk}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Please wait
            </>
          ) : (
            "Sure"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

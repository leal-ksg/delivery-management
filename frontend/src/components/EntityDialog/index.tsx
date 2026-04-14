import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type EntityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  classname?: string;
};

export function EntityDialog({
  open,
  onOpenChange,
  title,
  children,
  classname,
}: EntityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "bg-light-foreground max-h-screen overflow-y-scroll md:overflow-auto",
          classname,
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-bold border-b border-zinc-400">
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}

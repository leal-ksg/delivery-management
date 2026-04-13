import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type EntityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

export function EntityDialog({
  open,
  onOpenChange,
  title,
  children,
}: EntityDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-light-foreground max-h-screen overflow-y-scroll md:overflow-auto">
        <DialogHeader className="">
          <DialogTitle className="text-primary text-xl font-bold border-b border-zinc-400">
            {title}
          </DialogTitle>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}

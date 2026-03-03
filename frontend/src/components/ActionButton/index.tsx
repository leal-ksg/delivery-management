import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  icon?: LucideIcon;
  className?: string;
}

export default function ActionButton({
  onClick,
  icon: Icon,
  className = "",
  ...props
}: ActionButtonProps) {
  return (
    <div>
      <Button
        {...props}
        onClick={onClick}
        className={cn(
          "w-9 h-9 bg-white hover:bg-neutral-100 cursor-pointer text-foreground rounded-full shadow-md border-input",
          className,
        )}
      >
        {Icon && <Icon size={16} />}
      </Button>
    </div>
  );
}

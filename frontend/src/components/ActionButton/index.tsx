import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
  children?: ReactNode;
}

export default function ActionButton({
  onClick,
  icon: Icon,
  className = "",
  children,
  ...props
}: ActionButtonProps) {
  function handleClick() {
    if (onClick) onClick();
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        className={cn(
          "min-w-9 min-h-9 bg-white hover:bg-neutral-100 cursor-pointer text-foreground rounded-full shadow-md border-input disabled:text-gray-500",
          className,
        )}
        {...props}
      >
        {Icon && <Icon size={16} />}

        {children && children}
      </Button>
    </div>
  );
}

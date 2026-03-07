import { Button } from "@/components/ui/button";
import { ChevronLeftCircle } from "lucide-react";

interface ToolbarProps {
  description: string;
  showGoBack?: boolean;
}

export function Toolbar({ description, showGoBack = false }: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 justify-center w-full h-14.5 px-10 bg-primary text-secondary n md:text-cyan-400 md:mt-2 md:justify-start md:h-13 md:rounded-full md:w-[75%] fixed z-40">
      {showGoBack && (
        <button className="h-10 w-10 p-0">
          <ChevronLeftCircle className="" size={22}/>
        </button>
      )}
      <h1 className="text-2xl font-semibold brightness-130">{description}</h1>
    </div>
  );
}

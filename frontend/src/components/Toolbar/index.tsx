import { ChevronLeftCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ToolbarProps {
  description: string;
  showGoBack?: boolean;
}

export function Toolbar({ description, showGoBack = false }: ToolbarProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 justify-center w-full h-14.5 px-10 bg-slate-800 text-secondary md:justify-start md:h-13 sticky top-0 z-40">
      {showGoBack && (
        <button
          className="flex items-center justify-center h-10 w-10 p-0 hover:cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            router.back();
          }}
        >
          <ChevronLeftCircle size={22} />
        </button>
      )}
      <h1 className="text-2xl font-semibold brightness-130">{description}</h1>
    </div>
  );
}

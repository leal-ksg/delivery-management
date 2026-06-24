import { useEffect } from "react";
import { useToolbar } from "@/contexts/toolbar-context";

export function usePageToolbar(description: string, showGoBack = false) {
  const { setToolbar } = useToolbar();

  useEffect(() => {
    setToolbar({ description, showGoBack });

    return () => {
      setToolbar({
        description: "",
        showGoBack: false,
      });
    };
  }, [description, showGoBack, setToolbar]);
}

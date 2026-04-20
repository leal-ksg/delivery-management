"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as rootToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function toast(
  type: "success" | "error" | "warning" | "info",
  message: string,
  duration: number = 3500,
) {
  message =
    message.length > 100 && type === "error"
      ? "Ocorreu um erro inesperado no sistema"
      : message;

  switch (type) {
    case "success":
      rootToast.success(message, {
        style: {
          backgroundColor: "#4ade80",
          borderColor: "#10b981",
          fontSize: "18px",
        },
        duration,
        dismissible: true,
      });

      break;

    case "error":
      rootToast.error(message, {
        style: {
          backgroundColor: "#f87171",
          borderColor: "#b91c1c",
          fontSize: "18px",
        },
        duration,
        dismissible: true,
      });
      break;

    case "success":
      rootToast.warning(message, {
        style: {
          backgroundColor: "#eab308",
          borderColor: "#f59e0b",
          fontSize: "18px",
        },
        duration,
        dismissible: true,
      });
      break;

    case "success":
      break;
  }
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

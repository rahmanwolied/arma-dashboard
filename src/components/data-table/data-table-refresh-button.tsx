"use client";

import { Button } from "@/components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface DataTableRefreshButtonProps {
  onRefresh: () => Promise<{ success: boolean; message: string }>;
  label?: string;
}

export function DataTableRefreshButton({
  onRefresh,
  label = "Refresh",
}: DataTableRefreshButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const result = await onRefresh();
        if (result.success) {
          toast.success(result.message);
          router.refresh();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to refresh data");
        console.error(error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      className="h-8"
    >
      <IconRefresh
        className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`}
      />
      {label}
    </Button>
  );
}


"use client";

import type { Table } from "@tanstack/react-table";
import type * as React from "react";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { cn } from "@/lib/utils";

interface DataTableAdvancedToolbarProps<TData>
  extends React.ComponentProps<"div"> {
  table: Table<TData>;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  // Split children into main content and refresh button
  const childrenArray = React.Children.toArray(children);
  const refreshButton = childrenArray.find(
    (child) => React.isValidElement(child) && child.type?.name === "DataTableRefreshButton"
  );
  const otherChildren = childrenArray.filter(
    (child) => !(React.isValidElement(child) && child.type?.name === "DataTableRefreshButton")
  );

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className,
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">{otherChildren}</div>
      <div className="flex items-center gap-2">
        {refreshButton}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

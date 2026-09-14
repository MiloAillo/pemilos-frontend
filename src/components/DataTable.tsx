import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type OnChangeFn,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { classOptions } from "@/lib/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onSearchChange: (value: string) => void;
  onFilter: (value: string) => void;
  isVote?: boolean;
  onVoted?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  onPaginationChange,
  isLoading,
  onSearchChange,
  onFilter,
  isVote = false,
  onVoted,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [localSearch, setLocalSearch] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchChange(localSearch);
    }
  };

  const handleSearchClick = () => {
    onSearchChange(localSearch);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    pageCount: -1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    state: {
      columnFilters,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="py-4 ">
        <div className="flex justify-between w-full">
          <div className="flex gap-2 max-w-sm">
            <Input
              placeholder="Search Name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearchClick}>Search</Button>
          </div>
          <div className="flex gap-4">
            <Select
              onValueChange={(val) =>
                onFilter(val === "All" ? "" : val === "admin" ? "" : val)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="dark">
                <SelectItem value="All">All</SelectItem>
                {classOptions.map((clas) => (
                  <SelectItem key={clas} value={clas}>
                    {clas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isVote && (
              <Select
                onValueChange={(val) => onVoted?.(val === "All" ? "" : val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select voted" />
                </SelectTrigger>
                <SelectContent className="dark">
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-6"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-16"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage() || isLoading}
        >
          Previous
        </Button>
        {/* <span>{pagination.pageIndex + 1}</span> */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage() || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

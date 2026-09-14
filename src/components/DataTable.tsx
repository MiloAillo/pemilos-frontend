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
import { useIsMobile } from "@/hooks/use-mobile";

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
  /**
   * Render function for a single row in mobile card view. Receives the
   * row object and its index in the current page. Required for the card
   * view to render; if omitted, the table falls back to its desktop view.
   */
  renderMobileCard?: (row: TData, index: number) => React.ReactNode;
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
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [localSearch, setLocalSearch] = useState("");
  const isMobile = useIsMobile();

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

  const rows = table.getRowModel().rows;
  const showCardView = isMobile && renderMobileCard !== undefined;

  return (
    <div className="w-full">
      <div className="py-4">
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4">
          <div className="flex gap-2 w-full md:max-w-sm">
            <Input
              placeholder="Search Name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleSearchClick} className="shrink-0">
              Search
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full md:w-auto">
            <Select
              onValueChange={(val) =>
                onFilter(val === "All" ? "" : val === "admin" ? "" : val)
              }
            >
              <SelectTrigger className="w-full sm:w-[180px]">
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
                <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Desktop / Tablet: standard table */}
      <div
        className={
          showCardView
            ? "hidden md:block overflow-hidden rounded-md border"
            : "overflow-hidden rounded-md border"
        }
      >
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
            ) : rows?.length ? (
              rows.map((row) => (
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

      {/* Mobile: card list */}
      {showCardView && (
        <div className="md:hidden">
          {isLoading ? (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Loading...
            </div>
          ) : rows?.length ? (
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div key={row.id}>{renderMobileCard!(row.original, idx)}</div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between md:justify-end gap-2 py-4">
        <span className="text-xs text-muted-foreground md:hidden">
          Halaman {pagination.pageIndex + 1}
        </span>
        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            Previous
          </Button>
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
    </div>
  );
}
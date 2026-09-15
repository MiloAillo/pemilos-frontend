import type { UserType } from "@/schemas/user.schema";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { RefreshCcw } from "lucide-react";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { ROLE_BADGE_CLASS } from "./AdminTabel";

export const columns = (refetch: () => void): ColumnDef<UserType>[] => [
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const name = row.original;
      return (
        <div className="grid gap-[0.3]">
          <h1 className="font-bold">{name.name}</h1>
          <span className="text-xs">{name.class}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div
          className={`rounded-lg w-fit px-2 text-sm font-semibold ${
            ROLE_BADGE_CLASS[role] ?? "bg-red-500"
          }`}
        >
          {role}
        </div>
      );
    },
  },
  {
    accessorKey: "vote",
    header: "Vote",
    cell: ({ row }) => {
      const vote = row.original.isVoted;

      return (
        <div
          className={`rounded-lg w-fit px-2 text-sm font-semibold ${
            vote ? "bg-white text-black" : "border-2 border-white"
          }`}
        >
          {vote ? "Sudah" : "Belum"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const ResetData = async (username: string) => {
        try {
          await axios.put(
            `${apiUrl}/admin/reset`,
            { username },
            {
              headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `${localStorage.getItem("Authorization")}`,
              },
            }
          );
          refetch();
        } catch (error) {
          console.error("Failed to reset user:", error);
          throw error;
        }
      };

      return (
        <div className="flex gap-8">
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer">
              <RefreshCcw className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah ada yakin ingin mereset user ini?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-blue-500 text-white"
                  onClick={() => ResetData(user.username)}
                  disabled={!user.isVoted}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

/**
 * Mobile card view renderer for the vote list.
 */
export const renderVoteCard = (refetch: () => void) => {
  return (user: UserType) => {
    const ResetData = async (username: string) => {
      try {
        await axios.put(
          `${apiUrl}/admin/reset`,
          { username },
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `${localStorage.getItem("Authorization")}`,
            },
          }
        );
        refetch();
      } catch (error) {
        console.error("Failed to reset user:", error);
      }
    };

    return (
      <div className="rounded-xl border border-white/10 bg-neutral-900/60 p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-white truncate">{user.name}</h3>
            {user.class && (
              <p className="text-xs text-muted-foreground truncate">
                {user.class}
              </p>
            )}
          </div>
          <span
            className={`rounded-lg px-2 py-0.5 text-xs font-semibold text-white shrink-0 ${
              ROLE_BADGE_CLASS[user.role] ?? "bg-red-500"
            }`}
          >
            {user.role}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${
              user.isVoted
                ? "bg-white text-black"
                : "border border-white/40 text-white"
            }`}
          >
            {user.isVoted ? "Sudah Vote" : "Belum Vote"}
          </span>
          <AlertDialog>
            <AlertDialogTrigger
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200 hover:bg-sky-500/10 rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
              disabled={!user.isVoted}
            >
              <RefreshCcw className="size-4" />
              Reset
            </AlertDialogTrigger>
            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah ada yakin ingin mereset user ini?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-blue-500 text-white"
                  onClick={() => ResetData(user.username)}
                  disabled={!user.isVoted}
                >
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };
};

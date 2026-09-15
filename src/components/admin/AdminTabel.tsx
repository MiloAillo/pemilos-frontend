import type { UserType } from "@/schemas/user.schema";
import { type ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
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
import axios from "axios";
import { apiUrl } from "@/lib/api";

export const ROLE_BADGE_CLASS: Record<string, string> = {
  Murid: "bg-blue-500",
  Staff: "bg-orange-500",
  Guru: "bg-green-500",
  Admin: "bg-red-500",
};

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
    accessorKey: "_id",
    header: "UUID",
  },
  {
    accessorKey: "username",
    header: "Username",
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
    accessorKey: "password",
    header: "Password",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      const deleteUser = async () => {
        try {
          await axios.delete(`${apiUrl}/admin/user/${user._id}`, {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `${localStorage.getItem("Authorization")}`,
            },
          });
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
              <Trash className="size-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah ada yakin ingin menghapus user ini?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={() => deleteUser()}
                >
                  Delete
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
 * Mobile card view renderer for the user list. Suppresses UUID / Password
 * which are not readable at narrow widths.
 */
export const renderUserCard = (refetch: () => void) => {
  return (user: UserType) => {
    const deleteUser = async () => {
      try {
        await axios.delete(`${apiUrl}/admin/user/${user._id}`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        });
        refetch();
      } catch (error) {
        console.error("Failed to delete user:", error);
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

        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
          <span className="text-muted-foreground">Username</span>
          <span className="font-mono text-white/90 truncate">
            {user.username}
          </span>
          <span className="text-muted-foreground">Password</span>
          <span className="font-mono text-white/90 break-all select-all">
            {user.password}
          </span>
        </div>

        <div className="flex items-center justify-end pt-1 border-t border-white/5">
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-md transition-colors">
              <Trash className="size-4" />
              Hapus
            </AlertDialogTrigger>
            <AlertDialogContent className="dark text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah ada yakin ingin menghapus user ini?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white"
                  onClick={() => deleteUser()}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  };
};

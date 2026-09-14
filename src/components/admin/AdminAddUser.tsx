import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { classOptions } from "@/lib/class";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";

const AdminAddUser = ({
  children,
  isNewUser,
  refetch,
}: {
  children: React.ReactNode;
  isNewUser: boolean;
  refetch: () => void;
}) => {
  const [kelas, setKelas] = useState("");
  const [open, setOpen] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const kelas = formData.get("kelas") as string;

    const data = {
      name,
      username,
      password,
      kelas,
      role: "voter",
    };

    try {
      await axios.post(`${apiUrl}/admin/user`, data, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });
      refetch();
      toast("User Berhasil dibuat");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog modal={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto dark text-foreground p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Tambah User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Nama Lengkap</Label>
              <Input name="name" required />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm flex items-center justify-between flex-wrap gap-1">
                <span>Username</span>
                <span className="text-neutral-400 text-[11px]">*NIS / Nama Panggilan</span>
              </Label>
              <Input id="username-1" name="username" placeholder="ex: 11432" required />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm flex items-center justify-between flex-wrap gap-1">
                <span>Password</span>
                <span className="text-neutral-400 text-[11px]">*[6-char]:[username]</span>
              </Label>
              <Input name="password" placeholder="ex: zX8kV9:11432" required />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Kelas</Label>
              <Select onValueChange={setKelas}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent className="dark text-foreground max-h-60">
                  <SelectGroup>
                    {classOptions.map((clas) => (
                      <SelectItem key={clas} value={clas}>
                        {clas}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input type="hidden" name="kelas" value={kelas} />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto">
              {isNewUser ? "Add User" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddUser;

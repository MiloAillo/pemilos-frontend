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
      <DialogContent className="sm:max-w-[425px] dark text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="">Nama</Label>
              <Input name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="">Username</Label>
              <Input id="username-1" name="username" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="">Password</Label>
              <Input name="password" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="">Kelas</Label>
              <Select onValueChange={setKelas}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="dark text-foreground">
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isNewUser ? "Add User" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddUser;

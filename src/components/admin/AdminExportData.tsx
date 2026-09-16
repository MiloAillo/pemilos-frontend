import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import { apiUrl } from "@/lib/api";
import { toast } from "sonner";
import { classOptions } from "@/lib/class";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AdminExportData = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedClass) {
      toast.error("Silakan pilih kelas terlebih dahulu.");
      return;
    }

    setIsExporting(true);

    try {
      const response = await axios.get(
        `${apiUrl}/admin/user?class=${encodeURIComponent(selectedClass)}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );

      if (response.data.status === "success") {
        const filteredData: any = [];
        response.data.data.forEach(
          (user: { name: any; class: any; username: any; password: any }) => {
            const sanitize = (val: any) => {
              if (val == null) return "";
              return String(val).replace(/,/g, ".");
            };

            filteredData.push({
              NAMA: sanitize(user.name),
              KELAS: sanitize(user.class),
              USERNAME: sanitize(user.username),
              TOKEN: sanitize(user.password),
            });
          }
        );

        const headers = ["NAMA", "KELAS", "USERNAME", "TOKEN"];
        const csv = [
          headers.join(","),
          ...filteredData.map((row: { [x: string]: any }) =>
            headers.map((h) => row[h]).join(",")
          ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedClass}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Data berhasil diexport");
        setOpen(false);
        setSelectedClass("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Export data gagal. Silakan coba lagi.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog modal={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto dark text-foreground p-4 sm:p-6">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Export Data</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Gunakan ini untuk export data voter berdasarkan kelas ke file .CSV
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Pilih Kelas</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {classOptions.map((clas) => (
                    <SelectItem key={clas} value={clas}>
                      {clas}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" type="button" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isExporting || !selectedClass}
              className="w-full sm:w-auto"
            >
              {isExporting ? "Mengexport..." : "Export"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminExportData;

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
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { X, FileText, Upload } from "lucide-react";

const AdminImportData = ({
  children,
  refetch,
}: {
  children: React.ReactNode;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [isWithPassword, setIsWithPassword] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileRef = React.useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Format file tidak valid. Silakan upload file CSV.");
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleTabChange = (value: string) => {
    setIsWithPassword(value === "with-password");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Silakan pilih file CSV terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    const url = isWithPassword ? `${apiUrl}/admin/upload/csv` : `${apiUrl}/admin/upload/csv/token`

    try {
      await axios.post(url, formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "multipart/form-data",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });
      refetch();
      toast.success("Data berhasil diimport");
      setOpen(false);
      setSelectedFile(null);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      toast.error("Import data gagal. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
      handleRemoveFile();
    }
  };

  return (
    <Dialog modal={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark text-foreground">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              This form is used to add many voters at once using a CSV file.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label>Data Type</Label>
              <Tabs
                value={isWithPassword ? "with-password" : "no-password"}
                onValueChange={handleTabChange}
              >
                <TabsList className="w-full bg-transparent border border-neutral-800">
                  <TabsTrigger value="no-password" className="flex-1">
                    No Password
                  </TabsTrigger>
                  <TabsTrigger value="with-password" className="flex-1">
                    With Password
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-md font-mono text-xs overflow-x-auto">
              <p className="text-neutral-300 mb-2 text-[11px] font-medium bg-neutral-900 w-fit px-2.5 py-1 rounded border border-neutral-800">
                .CSV example
              </p>
              {isWithPassword ? (
                <div className="leading-relaxed">
                  <div className="text-cyan-400 font-semibold">
                    NAMA<span className="text-neutral-600">,</span>
                    USERNAME<span className="text-neutral-600">,</span>
                    KELAS<span className="text-neutral-600">,</span>
                    TOKEN
                  </div>
                  <div>
                    <span className="text-emerald-400">Faris Kahlil Haidar</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-sky-300">11432</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-amber-300">12 PPLG 3</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-rose-400">1q2w3e:11432</span>
                  </div>
                  <div>
                    <span className="text-emerald-400">Andi Pratama</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-sky-300">11521</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-amber-300">10 PPLG 1</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-rose-400">aB3xZ9:11521</span>
                  </div>
                </div>
              ) : (
                <div className="leading-relaxed">
                  <div className="text-cyan-400 font-semibold">
                    NAMA<span className="text-neutral-600">,</span>
                    USERNAME<span className="text-neutral-600">,</span>
                    KELAS
                  </div>
                  <div>
                    <span className="text-emerald-400">Faris Kahlil Haidar</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-sky-300">11432</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-amber-300">12 PPLG 3</span>
                  </div>
                  <div>
                    <span className="text-emerald-400">Andi Pratama</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-sky-300">11521</span>
                    <span className="text-neutral-600">,</span>
                    <span className="text-amber-300">10 PPLG 1</span>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <Label>CSV File</Label>
              {!selectedFile ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-neutral-500 hover:bg-neutral-800/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-400">Klik untuk upload file CSV</p>
                  <p className="text-xs text-neutral-500 mt-1">Format: .csv</p>
                </div>
              ) : (
                <div className="border border-neutral-700 rounded-lg p-3 flex items-center justify-between bg-neutral-800/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-neutral-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-neutral-700 rounded transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-neutral-400" />
                  </button>
                </div>
              )}
              <input
                type="file"
                ref={fileRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? "Mengimport..." : "Import"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminImportData;
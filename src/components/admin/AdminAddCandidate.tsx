import type { CandidateType } from "@/schemas/candidate.schema";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const AdminAddCandidate = ({
  children,
  candidate,
  isNewCandidate,
}: {
  children: React.ReactNode;
  candidate?: CandidateType;
  isNewCandidate: boolean;
}) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] max-h-[90vh] overflow-y-auto dark text-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {isNewCandidate ? "Add Candidate" : "Edit Candidate"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Nama</Label>
              <Input name="name" defaultValue={candidate?.name} />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Nomor</Label>
              <Input name="number" defaultValue={candidate?.number} />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs sm:text-sm">Foto</Label>
              <Input name="image" type="file" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full sm:w-auto">
              {isNewCandidate ? "Add Candidate" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AdminAddCandidate;

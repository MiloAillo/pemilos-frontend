import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/api";
import { classOptions } from "@/lib/class";
import axios from "axios";
import { useRef } from "react";

const GetToken = () => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const submit = async (e: React.FormEvent) => {
    const value = selectRef.current?.value;
    e.preventDefault();
    if (value) {
      try {
        const res = await axios.get(
          `${apiUrl}/admin/user?kelas=${encodeURIComponent(value)}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `${localStorage.getItem("Authorization")}`,
            },
          }
        );
        if (res.data.status === "success") {
          console.log(res.data);
          const filteredData: any = [];
          res.data.data.forEach(
            (user: { name: any; class: any; username: any; password: any }) => {
              const sanitize = (val: any) => {
                if (val == null) return "";
                return String(val).replace(/,/g, "."); // replace commas with dots
              };

              filteredData.push({
                NAMA: sanitize(user.name),
                KELAS: sanitize(user.class),
                USERNAME: sanitize(user.username),
                TOKEN: sanitize(user.password),
              });
            }
          );

          console.log(filteredData);

          // generate csv from filteredData
          const headers = ["NAMA", "KELAS", "USERNAME", "TOKEN"];
          const csv = [
            headers.join(","),
            ...filteredData.map((row: { [x: string]: any }) =>
              headers.map((h) => row[h]).join(",")
            ),
          ].join("\n");

          // Prompt download
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${value}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Download Token</h1>
      <form
        onSubmit={(e) => {
          submit(e);
        }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:h-10 max-w-md"
      >
        <select
          ref={selectRef}
          name="kelas"
          id="kelas"
          className="text-white bg-neutral-900 border border-white/20 p-2 rounded-md w-full h-10 text-sm"
        >
          {classOptions.map((clas) => (
            <option key={clas} className="text-black bg-white" value={clas}>
              {clas}
            </option>
          ))}
        </select>
        <Button type="submit" className="h-10 rounded-md shrink-0">
          Download
        </Button>
      </form>
    </section>
  );
};

export default GetToken;

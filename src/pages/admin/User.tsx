import AdminAddUser from "@/components/admin/AdminAddUser";
import { columns, renderUserCard } from "@/components/admin/AdminTabel";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/schemas/user.schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { apiUrl } from "@/lib/api";
import axios from "axios";
import AdminImportData from "@/components/admin/AdminImportData";
import AdminExportData from "@/components/admin/AdminExportData";
import { toast } from "sonner";

const User = () => {
  const [userData, setUserData] = useState<UserType[]>([]);
  const [page, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 40,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const role = (filter === "ADMIN" ? "admin": "voter")

  useEffect(() => {
    setPage((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filter]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/admin/user?name=${search}&class=${filter}&role=${role}&page=${
          page.pageIndex + 1
        }`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `${localStorage.getItem("Authorization")}`,
          },
        }
      );
      setUserData(response.data.data);
    } catch (error) {
      console.log(error);
      toast("Gagal mengambil data")
    } finally {
      setLoading(false);
    }
  }, [search, filter, page.pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedColumns = useMemo(() => columns(fetchData), [fetchData]);
  const memoizedCardRenderer = useMemo(() => renderUserCard(fetchData), [fetchData]);

  return (
    <section>
      <div className="flex flex-col gap-3 w-full md:flex-row md:justify-between md:items-center mb-2">
        <h1 className="text-2xl font-bold">User</h1>
        <div className="flex flex-wrap gap-2">
          {/* <Button onClick={() => (window.location.href = "/admin/gettoken")}>
            Download Token
          </Button> */}
          <AdminImportData refetch={fetchData}>
            <Button type="button">Import Data</Button>
          </AdminImportData>
          <AdminExportData>
            <Button type="button">Export Data</Button>
          </AdminExportData>
          <AdminAddUser refetch={fetchData} isNewUser={true}>
            <Button type="button">Tambah Voter</Button>
          </AdminAddUser>
        </div>
      </div>

      <div className="grid gap-2 mt-4">
        <DataTable
          columns={memoizedColumns}
          data={userData}
          pagination={page}
          onPaginationChange={setPage}
          isLoading={loading}
          onSearchChange={setSearch}
          onFilter={setFilter}
          renderMobileCard={memoizedCardRenderer}
        />
      </div>
    </section>
  );
};

export default User;

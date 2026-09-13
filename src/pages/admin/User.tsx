import AdminAddUser from "@/components/admin/AdminAddUser";
import { columns } from "@/components/admin/AdminTabel";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import type { UserType } from "@/schemas/user.schema";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { apiUrl } from "@/lib/api";
import axios from "axios";

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
        `${apiUrl}/admin/user?name=${search}&kelas=${filter}&role=${role}&page=${
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
    } finally {
      setLoading(false);
    }
  }, [search, filter, page.pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedColumns = useMemo(() => columns(fetchData), [fetchData]);

  return (
    <section>
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">User</h1>
        <div className="flex gap-2">
          <Button onClick={() => (window.location.href = "/admin/gettoken")}>
            Download Token
          </Button>
          <Button>Ekspor (Excel)</Button>
          <Button>Tambah (CSV)</Button>
          <AdminAddUser refetch={fetchData} isNewUser={true}>
            <Button type="button">Tambah</Button>
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
        />
      </div>
    </section>
  );
};

export default User;

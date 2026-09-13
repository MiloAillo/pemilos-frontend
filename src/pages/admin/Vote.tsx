import { columns } from "@/components/admin/AdminVote";
import { DataTable } from "@/components/DataTable";
import { apiUrl } from "@/lib/api";
import type { IsVotedType, UserType } from "@/schemas/user.schema";
import type { PaginationState } from "@tanstack/react-table";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

const Vote = () => {
  const [userData, setUserData] = useState<UserType[]>([]);
  const [page, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 40,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [voted, setVoted] = useState("");
  const [votedData, setVotedData] = useState<IsVotedType[]>([]);
  const role = filter === "ADMIN" ? "admin" : "voter";

const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiUrl}/admin/user?isVoted=${voted}&name=${search}&kelas=${filter}&role=${role}&page=${
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

      const res = await axios.get(`${apiUrl}/admin/count`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `${localStorage.getItem("Authorization")}`,
        },
      });
      setVotedData(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [voted, search, filter, page.pageIndex]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage((prev) => ({ ...prev, pageIndex: 0 }));
  }, [fetchData]);

  const memoizedColumns = useMemo(() => columns(fetchData), [fetchData]);

  return (
    <section>
      <h1 className="text-2xl font-bold">Vote</h1>

      <div className="grid gap-2 mt-4">
        <div className="w-full px-2 py-2 rounded-xl border-2 text-center">
          Sudah Voting: {votedData.find((item) => item._id === true)?.count ?? 0}, Belum Voting: {votedData.find((item) => item._id === false)?.count ?? 0}
        </div>
        <DataTable
          columns={memoizedColumns}
          data={userData}
          pagination={page}
          onPaginationChange={setPage}
          isLoading={loading}
          onSearchChange={setSearch}
          onFilter={setFilter}
          isVote={true}
          onVoted={setVoted}
        />
      </div>
    </section>
  );
};

export default Vote;

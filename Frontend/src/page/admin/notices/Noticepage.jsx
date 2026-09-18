import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import notices, { NoticeApi } from "../../../data/notices";
import NoticeStats from "../../../components/admin/NoticeStats";
import NoticeFilters from "../../../components/admin/NoticeFilters";
import NoticeList from "../../../components/admin/NoticeList";
import { api } from "../../../data/api";

function NoticePage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [notice, SetNotice] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [dashboard, setDashboard] = useState([]);
  const fetchAllNotice = async (parem) => {
    try {
      SetLoading(true);
      const response = await NoticeApi.getAll(parem);
      SetNotice(response.data);
    } catch (error) {
      console.log("Error", error);
    } finally {
      SetLoading(false);
    }
  };
  useEffect(() => {
    fetchAllNotice();
  }, []);
  console.log(notice);

  const handleCreateNotice = () => {
    navigate("/admin/notice/add");
  };
  const handleEdit = async (notice) => {
    try {
      navigate(`/admin/notice/add/${notice.id}`);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const handleDelete = async (notice) => {
    await NoticeApi.delete(notice.id);
    fetchAllNotice();
  };
  useEffect(() => {
    const fetchDash = async () => {
      try {
        const res = await api.get("/notice/getNoticeDashboard");
        setDashboard(res?.data?.data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchDash();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-blue-600 dark:border-blue-400"></div>
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-lg dark:text-white font-semibold text-gray-800">
          Notice Management
        </h1>
        <NoticeStats notices={notices} />
        <NoticeFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          audienceFilter={audienceFilter}
          onAudienceChange={setAudienceFilter}
          onCreateNotice={handleCreateNotice}
        />

        <NoticeList
          notices={notice}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default NoticePage;

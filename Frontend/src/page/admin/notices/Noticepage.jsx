import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import notices, { NoticeApi } from "../../../data/notices";
import NoticeStats from "../../../components/admin/NoticeStats";
import NoticeFilters from "../../../components/admin/NoticeFilters";
import NoticeList from "../../../components/admin/NoticeList";

function NoticePage() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [notice, SetNotice] = useState([]);
  const [loading, SetLoading] = useState(false);
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

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Notice...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-lg font-semibold text-gray-800">
            Notice Management
          </h1>

          <NoticeFilters
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            audienceFilter={audienceFilter}
            onAudienceChange={setAudienceFilter}
            onCreateNotice={handleCreateNotice}
          />

          <NoticeStats notices={notices} />

          <NoticeList
            notices={notice}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </>
  );
}

export default NoticePage;

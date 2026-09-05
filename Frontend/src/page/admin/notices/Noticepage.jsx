import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import notices, { NoticeApi } from "../../../data/notices";
import NoticeStats from "../../../components/admin/NoticeStats";
import NoticeFilters from "../../../components/admin/NoticeFilters";
import NoticeList from "../../../components/admin/NoticeList";

function NoticePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
  const filteredNotices = useMemo(() => {}, [searchValue, audienceFilter]);

  const handleCreateNotice = () => {
    navigate("/notice/add");
  };

  const handleEdit = async (notice) => {
    try {
      navigate(`/notice/add/${notice.id}`);
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDelete = async (notice) => {
    await NoticeApi.delete(notice.id);
    fetchAllNotice();
  };
  if (currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {loading ? (
        <div className="flex text-center justify-center items-center min-h-screen bg-white w-full">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
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

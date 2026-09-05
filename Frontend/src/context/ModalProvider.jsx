import { createContext, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  const openDeleteModal = (callback) => {
    setStatus("idle");
    setModalConfig({ callback });
  };

  const closeDeleteModal = () => {
    if (status === "loading") return; 
    setModalConfig(null);
    setStatus("idle");
  };

  const handleConfirm = async () => {
    if (!modalConfig?.callback) return;
    setStatus("loading");

    try {
      await modalConfig.callback();
      setStatus("success");
      setTimeout(() => {
        setModalConfig(null);
        setStatus("idle");
      }, 1200); // Auto-close modal after 1.2 seconds on success
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <ModalContext.Provider value={{ openDeleteModal }}>
      {children}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="flex flex-col items-center bg-white shadow-xl rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200 transition-all">
            
            {/* Initial Confirmation State */}
            {status === "idle" && (
              <>
                <div className="flex items-center justify-center p-4 bg-red-100 rounded-full text-red-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.875 5.75h1.917m0 0h15.333m-15.333 0v13.417a1.917 1.917 0 0 0 1.916 1.916h9.584a1.917 1.917 0 0 0 1.916-1.916V5.75m-10.541 0V3.833a1.917 1.917 0 0 1 1.916-1.916h3.834a1.917 1.917 0 0 1 1.916 1.916V5.75m-5.75 4.792v5.75m3.834-5.75v5.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="text-gray-900 font-semibold mt-4 text-xl">Are you sure?</h2>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Do you really want to continue? This action<br />cannot be undone.
                </p>
                <div className="flex items-center justify-center gap-4 mt-5 w-full">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full md:w-36 h-10 rounded-md text-white bg-red-600 font-medium text-sm hover:bg-red-700 active:scale-95 transition cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {/* Custom Circular Spinner Loading State */}
            {status === "loading" && (
              <div className="py-8 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-700">Deleting record...</p>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="py-8 flex flex-col items-center gap-3">
                <CheckCircle2 size={38} className="text-green-600 animate-bounce" />
                <p className="text-sm font-semibold text-green-600">Deleted Successfully!</p>
              </div>
            )}

            {/* Error State */}
            {status === "error" && (
              <div className="py-8 flex flex-col items-center gap-3">
                <XCircle size={38} className="text-red-600" />
                <p className="text-sm font-semibold text-red-600">Failed to delete. Please try again.</p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-2 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useDeleteModal = () => useContext(ModalContext);
import { api } from "./api";

export const BookCategoryApi = {
  getAll: async (params) => {
    try {
      const response = await api.get("/library/bookcategory/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/library/bookcategory/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newBookCategory) => {
    try {
      const response = await api.post(
        "/library/bookcategory/store",
        newBookCategory,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, newBookCategory) => {
    try {
      const response = await api.put(
        `/library/bookcategory/update/${id}`,
        newBookCategory,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/library/bookcategory/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const BookApi = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/library/books/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/library/books/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newBook) => {
    try {
      const response = await api.post("/library/books/store", newBook, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, updateBook) => {
    try {
      const response = await api.put(
        `/library/books/update/${id}`,
        updateBook,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/library/books/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};
export const BookIssureApi = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get("/library/book-issure/index", { params });
      return response.data;
    } catch (error) {
      console.log("Error", error);
      return { data: [] };
    }
  },
  getShow: async (id) => {
    try {
      const response = await api.get(`/library/book-issure/show/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  addNew: async (newIssure) => {
    try {
      const response = await api.post("/library/book-issure/store", newIssure, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  upDate: async (id, updateIssure) => {
    try {
      const response = await api.put(
        `/library/book-issure/update/${id}`,
        updateIssure,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/library/book-issure/destroy/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
  ReturnIssurce: async (id) => {
    try {
      const response = await api.put(`/library/book-issure/returnBook/${id}`, {
        return_date: new Date().toISOString().split("T")[0],
      });
      return response.data;
    } catch (error) {
      console.log("Error", error);
    }
  },
};

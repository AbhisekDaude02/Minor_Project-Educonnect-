import API from "../api/axios";

// Upload study material
export const uploadNote = (formData) => {
  return API.post("/notes/uploadnote", formData);
};

// Get all study materials
export const getAllNotes = () => {
  return API.get("/notes/getallnotes");
};

// Search study materials
export const searchNotes = (params) => {
  return API.get("/notes/searchnotes", { params });
};

// Preview PDF
export const previewNote = (id) => {
  return API.get(`/notes/preview/${id}`, {
    responseType: "blob",
  });
};

// Download PDF
export const downloadNote = (id) => {
  return API.get(`/notes/download/${id}`, {
    responseType: "blob",
  });
};

// Delete study material
export const deleteNote = (id) => {
  return API.delete(`/notes/deletenotes/${id}`);
};
import { createSlice } from "@reduxjs/toolkit";
import { InheriGeneData, OnquerData } from "./data/CasesData";

const initialState = {
  inheriGene: [],
  onquer: [],
  files: [],
};

const Cases = createSlice({
  name: "fileUpload",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      if (action.payload.product == "Inherigene") {
        state.inheriGene = [...InheriGeneData];
        state.files = [...InheriGeneData];
      } else {
        state.onquer = [...OnquerData];
        state.files = [...OnquerData];
      }
    },
    addFile: (state, action) => {
      state.files = [{ ...action.payload }, ...state.files];
    },
    addFiles: (state, action) => {
      state.files = [...action.payload, ...state.files];
    },
    editFile: (state, action) => {
      // action.payload should have: id, updatedFields
      const { id, updatedFields } = action.payload;
      const idx = state.files.findIndex((f) => f.id === id);
      if (idx !== -1) {
        state.files[idx] = { ...state.files[idx], ...updatedFields };
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    deleteFile: (state, action) => {
      state.files = state.files.filter(
        (file) => file.sampleID !== action.payload
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearFiles: (state) => {
      state.files = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  addFile,
  addFiles,
  setStatus,
  setError,
  clearFiles,
  editFile,
  setInitialData,
  deleteFile,
} = Cases.actions;
export default Cases.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { error } from "ajv/dist/vocabularies/applicator/dependencies";

const initialState = {
  error: "",
  token: "",
  rememberMe: false,
  user: {
    id: "",
    name: "",
    email: "",
    role: "",
    Password: "",
  },
  product: "",
  isInherigene: false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    onLogin: (state, action) => {
      const { user, rememberMe } = action.payload;
      state.user.id = "1";
      state.user.name = user.email;
      state.user.email = user.email;
      state.user.role = "user";
      state.error = "";

      state.token = "token";
      state.user.Password = user.Password;
      state.rememberMe = rememberMe;
    },
    logout: () => {
      return initialState;
    },
    addProduct: (state, action) => {
      state.product = action.payload;
      console.log("Product added:", action.payload);
      state.isInherigene = action.payload.toLowerCase() === "inherigene";
    },
  },
});

export const { onLogin, logout, addProduct } = loginSlice.actions;

export default loginSlice.reducer;

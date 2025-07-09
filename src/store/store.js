import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./loginSlice";
import fileUploadReducer from "./fileUploadSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import CasesReducer from "./CasesSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login", "files", "cases"], // persist these slices
};

const rootReducer = {
  login: counterReducer,
  files: fileUploadReducer,
  cases: CasesReducer,
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  // combine reducers manually
  return {
    login: rootReducer.login(state?.login, action),
    files: rootReducer.files(state?.files, action),
    cases: rootReducer.cases(state?.cases, action),
  };
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

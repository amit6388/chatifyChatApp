import { configureStore } from "@reduxjs/toolkit";
import {persistStore,persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage";
import rootReducer from "./slices";

const persistConfig={
    key:"auth",
    storage
}

const persisterReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
    reducer:persisterReducer
})
export const persistor = persistStore(store)
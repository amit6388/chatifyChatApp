"use client";
import React from "react";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "@/store";
import { Provider } from "react-redux";
import RequireAuth from "./RequireAuth";
import { ToastContainer } from "react-toastify";
import CurrentChatProvider from "@/context/CurrentChatContext";
import SocketProvider from "@/context/SocketContext";
export default function StoreProvider({ children }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <CurrentChatProvider>
              <RequireAuth>{children}</RequireAuth>
            </CurrentChatProvider>
          </SocketProvider>
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </PersistGate>
      </Provider>
    </>
  );
}

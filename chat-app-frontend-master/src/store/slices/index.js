import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";

const rootReducer = combineReducers({
    auth:auth
})

export default rootReducer
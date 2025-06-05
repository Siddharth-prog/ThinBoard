import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { boardApi } from "@/features/api/boardApi";

const rootReducer = combineReducers({
    auth:authReducer,
    [authApi.reducerPath]:authApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    
});
export default rootReducer;
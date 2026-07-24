// Typed Redux hooks shared by both apps. RootState comes from the shared reducer
// map; AppDispatch is thunk-aware so dispatching async thunks type-checks.
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { RootState } from "./rootReducer";

export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

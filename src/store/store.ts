import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import rootReducer, { RootState } from "./root-reducer"; // Assuming rootReducer is typed

// ----------------------------------------------------------------------

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
      immutableCheck: false, // Disable immutable check for performance
    }),
});

export type AppDispatch = typeof store.dispatch; // AppDispatch type

// Typed hooks for useSelector and useDispatch
const useDispatch = () => useAppDispatch<AppDispatch>(); // Typed useDispatch
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector; // Typed useSelector

// Destructure dispatch from the store
const { dispatch } = store;

// Export everything
export { dispatch, store, useDispatch, useSelector };

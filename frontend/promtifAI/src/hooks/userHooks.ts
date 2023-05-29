import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { typeDispatch, typeRoot } from "../store";

export const useUserDispatch = () => useDispatch<typeDispatch>();
export const useUserSelector: TypedUseSelectorHook<typeRoot> = useSelector;
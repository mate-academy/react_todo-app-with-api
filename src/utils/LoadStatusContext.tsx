import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from 'react';
import { initData } from '../constants/initData';

type LoadStatusContent = {
  loadingStatus: number[],
  setLoadingStatus: Dispatch<SetStateAction<number[]>>,
};

export const LoadStatusContext = createContext<LoadStatusContent>({
  loadingStatus: initData.loadingState,
  setLoadingStatus: () => {},
});

export const useLoadStatusContext = () => useContext(LoadStatusContext);

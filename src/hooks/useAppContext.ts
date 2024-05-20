import { useContext } from 'react';
import { AppContext } from '../wrappers/AppProvider';

export const useAppContext = () => useContext(AppContext);

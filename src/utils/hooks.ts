import { useContext } from 'react';
import { DispatchContext } from '../components/StateContext';
import { DELAY } from './constants';

export const useShowError = () => {
  const dispatch = useContext(DispatchContext);

  return (errorMessage: string, delay: number = DELAY) => {
    dispatch({ type: 'showError', peyload: errorMessage });
    setTimeout(() => dispatch(
      { type: 'showError', peyload: '' },
    ), delay);
  };
};

export const useHideError = () => {
  const dispatch = useContext(DispatchContext);

  return () => {
    dispatch({ type: 'showError', peyload: '' });
  };
};

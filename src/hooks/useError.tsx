import { useDispatch, useSelector } from '../providers/TodosContext';

export const useError = () => {
  const { errorMessage } = useSelector();
  const dispatch = useDispatch();

  const setError = (error: string) => dispatch({
    type: 'setError',
    payload: {
      isError: true,
      errorMessage: error,
    },
  });

  return { errorMessage, setError };
};

import { useDispatch, useSelector } from '../providers/TodosContext';
import { ActionType } from '../types/ActionType';

export const useError = () => {
  const { errorMessage } = useSelector();
  const dispatch = useDispatch();

  const setError = (error: string) => dispatch({
    type: ActionType.SetError,
    payload: {
      isError: true,
      errorMessage: error,
    },
  });

  return { errorMessage, setError };
};

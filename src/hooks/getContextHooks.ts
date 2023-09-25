import { useContext } from 'react';
import { patchTodo } from '../api/todos';
import { patchTodoAction } from '../Context/actions/actionCreators';
import { TodosContext, ApiErrorContext } from '../Context';

type UsePatchTodoType = {
  id: number,
  data: object,
  setIsTodoSpinned: React.Dispatch<React.SetStateAction<boolean>>
};

export const usePatchTodo = (args: UsePatchTodoType) => {
  const { dispatch } = useContext(TodosContext);
  const { setApiError } = useContext(ApiErrorContext);
  const {
    id,
    data,
    setIsTodoSpinned,
  } = args;

  return patchTodo(id, data)
    .then((patchedTodo) => {
      const patchAction = patchTodoAction(patchedTodo);

      dispatch(patchAction);
    })
    .catch((error) => {
      setApiError(error);
    })
    .finally(() => {
      setIsTodoSpinned(false);
    });
};

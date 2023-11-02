// eslint-disable-next-line import/extensions
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { Action, ActionType } from '../states/Reducer';
import { ErrorType } from '../types/ErrorType';

type Dispatch = (_action: Action) => void;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (
  todo: Omit<Todo, 'id'>,
) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (
  dispatch: Dispatch,
  todoId: number,
) => {
  return client.delete(`/todos/${todoId}`)
    .then(() => {
      dispatch({
        type: ActionType.DeleteTodo,
        payload: { id: todoId },
      });
    })
    .catch(() => {
      dispatch({
        type: ActionType.ToggleError,
        payload: { errorType: ErrorType.DeleteError },
      });
    });
};

export const updateTodo = (
  todo: Todo,
  dispatch: Dispatch,
) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo)
    .then((updatedTodo) => {
      dispatch({
        type: ActionType.UpdateTodo,
        payload: { updatedTodo },
      });
    })
    .catch(() => {
      dispatch({
        type: ActionType.ToggleError,
        payload: { errorType: ErrorType.UpdateError },
      });

      throw new Error();
    });
};

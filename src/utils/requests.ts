import { completeTodo, deleteTodo, postTodo, updateTodo } from '../api/todos';
import { Action } from '../types/Action';
import { Todo } from '../types/Todo';

export const addPost = (
  dispatch: (action: Action) => void,
  title: string,
): Promise<void> => {
  dispatch({ type: 'setError', message: '' });

  return postTodo(title)
    .then((newTodo: Todo) => {
      dispatch({ type: 'add', todo: newTodo });
    })
    .catch(error => {
      dispatch({ type: 'setError', message: 'Unable to add a todo' });
      throw error;
    })
    .finally(() => dispatch({ type: 'setShouldFocus' }));
};

export const onDelete = (
  dispatch: (action: Action) => void,
  id: number,
): Promise<void> => {
  dispatch({ type: 'setLoadingTodo', id, value: true });

  return deleteTodo(id)
    .then(() => {
      dispatch({ type: 'delete', id });
    })
    .catch(error => {
      dispatch({ type: 'setError', message: 'Unable to delete a todo' });
      throw error;
    })
    .finally(() => {
      dispatch({ type: 'setLoadingTodo', id, value: false });
      dispatch({ type: 'setShouldFocus' });
    });
};

export const onCompleteDelete = (
  todos: Todo[],
  dispatch: (action: Action) => void,
) => {
  return () => {
    todos
      .filter(todo => todo.completed)
      .forEach(todo => onDelete(dispatch, todo.id));
  };
};

export const onComplete = (
  dispatch: (action: Action) => void,
  id: number,
  completed: boolean,
) => {
  dispatch({ type: 'setLoadingTodo', id, value: true });

  return completeTodo({ id, completed })
    .then(todo =>
      dispatch({
        type: 'complete',
        id: todo.id,
        value: todo.completed,
      }),
    )
    .catch(error => {
      dispatch({ type: 'setError', message: 'Unable to update a todo' });
      throw error;
    })
    .finally(() => dispatch({ type: 'setLoadingTodo', id, value: false }));
};

export const onToggleAll = (
  dispatch: (action: Action) => void,
  todos: Todo[],
) => {
  const unCompletedAll = todos.filter(todo => !todo.completed);

  if (unCompletedAll.length > 0) {
    unCompletedAll.forEach(todo => onComplete(dispatch, todo.id, true));
  } else {
    todos.forEach(todo => onComplete(dispatch, todo.id, false));
  }
};

export const onUpadateTodo = (
  dispatch: (action: Action) => void,
  id: number,
  title: string,
) => {
  dispatch({ type: 'setLoadingTodo', id, value: true });

  return updateTodo({ id, title })
    .then(todo => dispatch({ type: 'edit', id: todo.id, value: todo.title }))
    .catch(error => {
      dispatch({ type: 'setError', message: 'Unable to update a todo' });
      throw error;
    })
    .finally(() => dispatch({ type: 'setLoadingTodo', id, value: false }));
};

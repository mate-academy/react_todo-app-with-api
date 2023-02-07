import { useCallback } from 'react';
import { updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';

type Props = {
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: ((message: string) => void);
  isAllCompletedTodos: boolean;
  todos: Todo[];
};

type HookOutput = [
  (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  () => void,
];

export const useUpdatingTodo = (props: Props): HookOutput => {
  const {
    setLoadingTodosIds,
    setTodos,
    showError,
    isAllCompletedTodos,
    todos,
  } = props;

  const editTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setLoadingTodosIds((prevIds) => ([...prevIds, todoId]));

    try {
      await updateTodo(todoId, fieldsToUpdate);

      setTodos((prevTodos) => (prevTodos.map(
        todo => {
          const isUpdated = todo.id === todoId;

          return isUpdated
            ? Object.assign(todo, fieldsToUpdate)
            : todo;
        },
      )));
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingTodosIds((prevIds) => (prevIds.filter(
        todoIdToEdit => todoIdToEdit !== todoId,
      )));
    }
  }, []);

  const handleToggleAll = useCallback(() => {
    const desiredStatus = !isAllCompletedTodos;

    todos.forEach(async (todo) => {
      if (todo.completed !== desiredStatus) {
        await editTodo(todo.id, { completed: desiredStatus });
      }
    });
  }, [isAllCompletedTodos, todos]);

  return [editTodo, handleToggleAll];
};

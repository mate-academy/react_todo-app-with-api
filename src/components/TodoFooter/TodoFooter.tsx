import {
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useMemo,
} from 'react';
import { Todo } from '../../types/Todo';
import { removeTodoById } from '../../api/todos';
import { Navbar } from '../Navbar';

type Props = {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  handleError: (msg: string) => void,
  setLoadingIds: Dispatch<SetStateAction<number[]>>,
};

export const TodoFooter: FC<Props> = memo((props) => {
  const {
    todos,
    setTodos,
    handleError,
    setLoadingIds,
  } = props;

  const completedTodosIds = useMemo(() => (
    todos.filter(todo => todo.completed).map(todo => todo.id)
  ), [todos]);

  const handleRemoveCompletedTodos = useCallback(
    () => {
      setLoadingIds(prev => [...prev, ...completedTodosIds]);
      const requests = completedTodosIds.map(id => removeTodoById(id));

      Promise.all(requests)
        .then(() => setTodos(prev => prev.filter(todo => !todo.completed)))
        .catch(() => handleError('Unable to delete todos'))
        .finally(() => setLoadingIds(prev => (
          prev.filter(id => !completedTodosIds.includes(id)))));
    },
    [completedTodosIds],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodosIds.length} items left`}
      </span>

      <Navbar />

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
        disabled={completedTodosIds.length === 0}
      >
        Clear completed
      </button>

    </footer>
  );
});

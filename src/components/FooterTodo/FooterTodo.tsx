import {
  Dispatch, memo, SetStateAction, useCallback,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { FilterLink } from './FilterLink';

interface Props {
  lengthActive: number;
  lengthCompleted: number;
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  onLoading: (loading: boolean) => void;
  onError: (errorMessage: string) => void;
  onSelected: (todoId: number | null) => void;
  onChanged: (ids: number[]) => void;
}

export const FooterTodo = memo<Props>((props) => {
  const {
    lengthActive,
    lengthCompleted,
    todos,
    setTodos,
    onError,
    onLoading,
    onSelected,
    onChanged,
  } = props;

  // ** clear all completed todo ** //
  const clearCompleted = useCallback(() => {
    const changedTodoId: number[] = [];

    todos.forEach(todo => {
      if (todo.completed) {
        changedTodoId.push(todo.id);
      }
    });

    const requests = changedTodoId.map(id => deleteTodo(id));

    onSelected(null);
    onChanged(changedTodoId);
    onLoading(true);
    Promise.all(requests)
      .then(() => setTodos(
        prev => prev.filter(todo => !changedTodoId.includes(todo.id)),
      ))
      .catch(() => onError('Unable to delete a todo'))
      .finally(() => {
        onLoading(false);
        onChanged([]);
      });
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${lengthActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <FilterLink to="/all" text="All" />
        <FilterLink to="/active" text="Active" />
        <FilterLink to="/completed" text="Completed" />
      </nav>

      {lengthCompleted > 0 ? (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      ) : (
        <button
          type="button"
          className="todoapp__clear-completed"
          style={{
            opacity: 0,
            cursor: 'auto',
            pointerEvents: 'none',
          }}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});

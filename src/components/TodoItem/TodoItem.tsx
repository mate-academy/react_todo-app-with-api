import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodosContext } from '../../hooks/useTodosContext';
import { deleteTodo, updateTodo } from '../../api/todos';
import { Errors } from '../../enums/Errors';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingTodoIds,
    setLoadingTodoIds,
    setTodos,
    showError,
    setIsFocusedInput,
  } = useTodosContext();

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
        setLoadingTodoIds([]);
        setIsFocusedInput(true);
      })
      .catch(() => {
        showError(Errors.DeleteTodo);
        setLoadingTodoIds([]);
        setIsFocusedInput(true);
      });

    setLoadingTodoIds([todoId]);
  };

  const toggleCompleted = (todoId: number, status: boolean) => {
    updateTodo(todoId, { completed: !status })
      .then(() => {
        setLoadingTodoIds([]);
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === todoId ? { ...t, completed: !status } : t,
          ),
        );
      })
      .catch(() => {
        showError(Errors.UpdateTodo);
        setLoadingTodoIds([]);
      });

    setLoadingTodoIds([todoId]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label" aria-label="todo__status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo.id, todo.completed)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

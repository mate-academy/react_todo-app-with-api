import cn from 'classnames';
import { useState } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Error } from '../types/Error';

interface Props {
  todo: Todo;

  isTodoLoading?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isTodoLoading }) => {
  const { setTodos, setError } = useTodoContext();
  const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [isTodoUpdating, setIsTodoUpdating] = useState(false);

  const handleTodoDelete = async () => {
    setIsTodoDeleting(true);

    try {
      await deleteTodo(todo.id);

      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
      setIsTodoDeleting(false);
    } catch (error) {
      setError(Error.DELETE);
      setIsTodoDeleting(false);
    }
  };

  const handleTodoStatusChange = () => {
    setIsTodoUpdating(true);

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    try {
      updateTodo(todo.id, updatedTodo);
      setTodos((prevTodos) => {
        return prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t));
      });

      setIsTodoUpdating(false);
    } catch {
      setError(Error.UPDATE);
      setIsTodoUpdating(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoStatusChange}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': isTodoDeleting || isTodoLoading || isTodoUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

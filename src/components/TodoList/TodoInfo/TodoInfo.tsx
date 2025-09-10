/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useEffect } from 'react';
import { Todo } from '../../../types/types';

export type Props = {
  todo: Todo;
  handleCheckTodo: (id: number) => void;
  handleDeleteTodos: (todoId: number) => void;
  activeTodoEdit: number | null;
  editTodoTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  handleEditTodo: (todoId: number, editTitle: string) => void;
  setEditTodoTitle: (value: string) => void;
  setActiveTodoEdit: (todoId: number | null) => void;
  loadingTodos: number[];
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleCheckTodo,
  handleDeleteTodos,
  editTodoTitle,
  inputRef,
  handleEditTodo,
  setEditTodoTitle,
  loadingTodos,
  activeTodoEdit,
  setActiveTodoEdit,
}) => {
  useEffect(() => {
    if (activeTodoEdit === todo.id && inputRef.current) {
      inputRef.current.focus();
      setEditTodoTitle(todo.title);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeTodoEdit === todo.id) {
        setActiveTodoEdit(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTodoEdit, todo.id, todo.title]);

  const handleActivateEdit = () => {
    setActiveTodoEdit(todo.id);
    setEditTodoTitle(todo.title);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={handleActivateEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleCheckTodo(todo.id)}
        />
      </label>

      {activeTodoEdit !== todo.id ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodos(todo.id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleEditTodo(todo.id, editTodoTitle);
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTodoTitle}
            onChange={event => setEditTodoTitle(event.target.value)}
            onBlur={() => handleEditTodo(todo.id, editTodoTitle)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

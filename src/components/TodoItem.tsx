import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useTodosContext } from '../context/TodoContextProvider';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isProcessing: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isProcessing }) => {
  const {
    handleToggleTodo,
    handleDeleteTodo,
    editingTodoId,
    setEditingTodoId,
    handleUpdateTodoTitle,
  } = useTodosContext();
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleEditSubmit = async () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (trimmedTitle === '') {
      try {
        await handleDeleteTodo(todo.id);
        setEditingTodoId(null); // <- teraz tylko po sukcesie
      } catch (error) {}

      return;
    }

    try {
      await handleUpdateTodoTitle(todo.id, trimmedTitle);
      setEditingTodoId(null);
    } catch (error) {}
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo)}
          disabled={isProcessing}
        />
      </label>

      {editingTodoId === todo.id ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleEditSubmit();
            } else if (e.key === 'Escape') {
              setEditingTodoId(null);
            }
          }}
          autoFocus
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setEditingTodoId(todo.id)}
        >
          {todo.title}
        </span>
      )}
      {editingTodoId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDeleteTodo(todo.id)}
          disabled={isProcessing}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        {/* eslint-disable-next-line max-len*/}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

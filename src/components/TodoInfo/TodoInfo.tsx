import cn from 'classnames';

import { useTodos } from '../context/TodosContext';

import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
};

export const TodoInfo: React.FC<Props> = ({ todo }) => {
  const { removeTodo, toggleOne, updateTodo, loadingTodoIds } = useTodos();
  const [idEditing, setIdEditing] = useState<number | null>(null);
  const [title, setTitle] = useState(todo.title);

  const isLoadingItem = loadingTodoIds.includes(todo.id) || todo.id === 0;

  const inputId = `todo-status-${todo.id}`;

  function saveEditedTodo() {
    const trimmedInput = title.trim();

    if (trimmedInput === todo.title) {
      setIdEditing(null);

      return;
    }

    if (!trimmedInput) {
      removeTodo(todo.id);
    } else {
      updateTodo({ ...todo, title: trimmedInput }, async () =>
        setIdEditing(null),
      );
    }
  }

  const handleKeyUp = async (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIdEditing(null);
    }

    if (event.key === 'Enter') {
      await saveEditedTodo();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label htmlFor={inputId} className="todo__status-label">
        <input
          aria-label="TodoStatus"
          id={inputId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleOne(todo.id)}
        />
      </label>
      {idEditing && (
        <form onSubmit={e => e.preventDefault()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onBlur={saveEditedTodo}
            onChange={e => setTitle(e.target.value)}
            onKeyUp={event => handleKeyUp(event)}
            autoFocus
          />
        </form>
      )}
      {!idEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIdEditing(todo.id);
              setTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoadingItem })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import React, { FormEvent, LegacyRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  currentTodos: Todo[];
  deleteTodo: (todo: Todo) => void;
  updateTodo: (todo: Todo) => void;
  newTodoField: LegacyRef<HTMLInputElement> | undefined;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  currentTodos,
  deleteTodo,
  updateTodo,
  newTodoField,
}) => {
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const initialTitle = todo.title;

  const handleOnBlurOrEnter = () => {
    setIsEditTitle(false);
    if (editedTitle === initialTitle) {
      return;
    }

    if (editedTitle.trim().length === 0) {
      deleteTodo(todo);

      return;
    }

    updateTodo({ ...todo, title: editedTitle });
  };

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    handleOnBlurOrEnter();
  };

  const handleOnEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditTitle(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>
      {!isEditTitle ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditTitle(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => deleteTodo(todo)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleOnSubmit}>
          <input
            value={editedTitle}
            data-cy="NewTodoField"
            type="text"
            ref={newTodoField}
            className="todoapp__new-todo"
            onChange={(event) => setEditedTitle(event.target.value)}
            onBlur={handleOnBlurOrEnter}
            onKeyDown={(e) => handleOnEscape(e)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': currentTodos.some((item) => item === todo),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

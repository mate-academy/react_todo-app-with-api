/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: Todo['id']) => void;
  handleChangeCompletion: (todo: Todo, newIsCompleted: boolean) => void;
  isBeingEdited?: boolean;
  isTemp?: boolean;
  updateTodoTitle: (todo: Todo, newTitle: string) => void;
  todoBeingUpdated: number | null;
};

const getTodoClass = (todo: Todo) =>
  classNames({
    todo: true,
    completed: todo.completed,
  });

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  handleChangeCompletion,
  isBeingEdited = false,
  isTemp = false,
  updateTodoTitle,
  todoBeingUpdated,
}) => {
  const [isBeingDeleted, setIsBeingDeleted] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.title);

  const todoTitleInput = useRef<HTMLInputElement>(null);

  const finishEditingTodo = () => {
    setIsFormOpen(false);
    setNewTodoTitle(newTodoTitle);
    // setTodoBeingUpdated(null)
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      finishEditingTodo();
    }
  };

  const handleUpdateTodoFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim().length) {
      setIsBeingDeleted(true);
    }

    if (todo.title === newTodoTitle) {
      setIsFormOpen(false);

      return;
    }

    updateTodoTitle(todo, newTodoTitle);

    Promise.resolve(() => {
      if (todoBeingUpdated === null) {
        finishEditingTodo();
        document.removeEventListener('keyup', handleEscapeKey);
      }
    });
  };

  useEffect(() => {
    if (isFormOpen) {
      todoTitleInput.current?.focus();
    }
  }, [isFormOpen]);

  // How to check whether the Todo was updated or an error was caught?

  return (
    <div
      data-cy="Todo"
      className={getTodoClass(todo)}
      onDoubleClick={() => {
        setIsFormOpen(true);
        // Check whether the Esc was clicked when editing the todo -> If so, close the form
        document.addEventListener('keyup', event => handleEscapeKey(event));
      }}
      onBlur={() => {
        updateTodoTitle(todo, newTodoTitle);
        setIsFormOpen(false);
        setNewTodoTitle(newTodoTitle);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            event.preventDefault();
            handleChangeCompletion(todo, !todo.completed);
          }}
          readOnly
        />
      </label>

      {/* Show the form only when the todo is double-clicked */}
      {isFormOpen && (
        <form onSubmit={handleUpdateTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            ref={todoTitleInput}
          />
        </form>
      )}

      {!isFormOpen && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsBeingDeleted(true);
              handleDeleteTodo(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames({
          modal: true,
          overlay: true,
          'is-active': isTemp || isBeingDeleted || isBeingEdited,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

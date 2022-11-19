import classNames from 'classnames';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void,
  completedTodos: Todo[],
  isDeleting: boolean,
  toggleTodo: (id: number, completed: boolean) => void,
  todosToToggle: Todo[],
  todoIdToUpdate: number,
  isUpdating: boolean,
  updateTodoTitle: (id: number, title: string) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  deleteTodo,
  completedTodos,
  isDeleting,
  toggleTodo,
  todosToToggle,
  todoIdToUpdate,
  isUpdating,
  updateTodoTitle,
}) => {
  const { id, title, completed } = todo;
  const [todoIdToDelete, setTodoIdToDelete] = useState(0);
  const [isTodoTitleFieldActive, setIsTodoTitleFieldActive] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const titleInputField = useRef<HTMLInputElement>(null);

  const cancelUpdating = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsTodoTitleFieldActive(false);
    }
  }, [newTitle, isTodoTitleFieldActive]);

  const submitNewTitle = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === title) {
      setNewTitle(trimmedNewTitle);
      setIsTodoTitleFieldActive(false);
    } else if (trimmedNewTitle === '') {
      deleteTodo(id);
    } else {
      updateTodoTitle(id, newTitle);
      setIsTodoTitleFieldActive(false);
    }
  }, [newTitle]);

  useEffect(() => {
    if (titleInputField.current) {
      titleInputField.current.focus();
    }
  }, [isTodoTitleFieldActive]);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => {
            toggleTodo(id, completed);
          }}
        />
      </label>

      {isTodoTitleFieldActive
        ? (
          <form
            onSubmit={submitNewTitle}
            onBlur={submitNewTitle}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleInputField}
              defaultValue={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyDown={cancelUpdating}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTodoTitleFieldActive(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                setTodoIdToDelete(id);
                deleteTodo(id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': id === 0
              || id === todoIdToDelete
              || (completedTodos.includes(todo) && isDeleting)
              || (todosToToggle.includes(todo) && isUpdating)
              || id === todoIdToUpdate,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

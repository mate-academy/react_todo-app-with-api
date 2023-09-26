/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { ErrorMessage, TodosContext } from '../TodosContext';
import { updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    handleRemoveTodo,
    setAlarm,
    setIsTodoChange,
    changingItems,
    setChangingItems,
    setTodos,
  } = useContext(TodosContext);

  const [isCompleted, setIsCompleted] = useState(completed);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedInput, setEditedInput] = useState(title);

  const editedFormInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdating && editedFormInput.current) {
      editedFormInput.current.focus();
    }
  }, [isUpdating]);

  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);

  const handleUpdateTodo = (val: boolean | string) => {
    let newTodo = todo;

    if (typeof val === 'boolean') {
      newTodo = {
        ...todo,
        completed: val,
      };
    }

    if (typeof val === 'string' && val.trim() !== '') {
      newTodo = {
        ...todo,
        title: val,
      };
    }

    if (newTodo) {
      setIsTodoChange(true);
      setChangingItems(current => [...current, id]);
      updateTodo(newTodo)
        .then(() => {
          setIsUpdating(false);
          setIsTodoChange(false);
          setTodos(currentTodos => currentTodos
            .map(currTodo => {
              return currTodo.id !== newTodo.id
                ? currTodo
                : newTodo;
            }));

          setIsCompleted(newTodo.completed);
        })
        .catch(() => {
          setAlarm(ErrorMessage.isUnableUpdateTodo);
          // setIsUpdating(true);
          // editedFormInput.current?.focus();
        })
        .finally(() => {
          setChangingItems([]);
        });
    }
  };

  const handleUpdateTodoTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInputValue = editedInput.trim();

    if (!trimmedInputValue) {
      handleRemoveTodo(todo);
    }

    if (trimmedInputValue === title) {
      setIsUpdating(false);

      return;
    }

    setIsTodoChange(true);
    handleUpdateTodo(trimmedInputValue);
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    setIsLoading(changingItems.includes(id));
  }, [changingItems]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: isCompleted },
      )}
      onDoubleClick={() => setIsUpdating(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo(!isCompleted)}
        />
      </label>

      {!isUpdating && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title.trim()}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      {isUpdating && (
        <form
          onSubmit={handleUpdateTodoTitle}
          onBlur={handleUpdateTodoTitle}
        >
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            ref={editedFormInput}
            placeholder="Empty todo will be deleted"
            value={editedInput}
            onChange={(event) => setEditedInput(event.target.value)}
            onKeyDown={handleEscape}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

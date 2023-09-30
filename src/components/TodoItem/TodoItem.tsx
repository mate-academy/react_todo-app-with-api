import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext';
import { updateTodo } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

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

  const [isUpdating, setIsUpdating] = useState(false);
  const [editedInput, setEditedInput] = useState(title);

  const editedFormInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUpdating && editedFormInput.current) {
      editedFormInput.current.focus();
    }
  }, [isUpdating]);

  const handleUpdateTodo = (updateFields: Partial<Todo>) => {
    const newTodo = {
      ...todo,
      ...updateFields,
    };

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
        })
        .catch(() => {
          setAlarm(ErrorMessage.isUnableUpdateTodo);
          editedFormInput.current?.focus();
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

      return;
    }

    if (trimmedInputValue === title) {
      setIsUpdating(false);

      return;
    }

    setIsTodoChange(true);
    handleUpdateTodo({ title: trimmedInputValue });
  };

  const handleEscape = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedInput(title);
      setIsUpdating(false);
    }
  };

  const isLoading = changingItems.includes(id);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      onDoubleClick={() => setIsUpdating(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdateTodo({ completed: !completed })}
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

import cn from 'classnames';
import {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { TodosContext } from '../../TodosContext';
import { KeyEvent } from '../../types/KeyEvent';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodosItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const {
    deleteTodo,
    updatingTodosId,
    updateTodo,
    todos,
    setTodos,
  } = useContext(TodosContext);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [updatingInputValue, setUpdatingInputValue] = useState(title);

  const editableInput = useRef<HTMLInputElement>(null);

  const isTodosUpdating = useMemo(() => (
    updatingTodosId.some(delId => delId === id)
  ), [updatingTodosId]);

  const handleDeleteButtonClick = () => {
    setIsUpdating(true);

    deleteTodo(id)
      .finally(() => setIsUpdating(false));
  };

  const handleStatusChange = () => {
    setIsUpdating(true);

    updateTodo(id, { completed: !completed })
      .then(() => {
        const newTodos = [...todos];
        const currentTodo = newTodos.find(t => t.id === id);

        if (currentTodo) {
          currentTodo.completed = !currentTodo.completed;
        }

        setTodos(newTodos);
      })
      .finally(() => setIsUpdating(false));
  };

  const handleDoubleClickTitle = () => {
    setIsBeingEdited(true);
  };

  const handleUpdatingInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdatingInputValue(e.target.value);
  };

  const editTodo = (todoId: number) => {
    setIsUpdating(true);

    const newValue = updatingInputValue.trim();

    if (!newValue) {
      deleteTodo(todoId)
        .finally(() => setIsUpdating(false));
    }

    if (newValue && newValue !== title) {
      updateTodo(todoId, { title: newValue })
        .then(() => {
          const newTodos = [...todos];
          const currentTodo = newTodos.find(t => t.id === todoId);

          if (currentTodo) {
            currentTodo.title = newValue;
          }

          setTodos(newTodos);
        })
        .finally(() => {
          setIsBeingEdited(false);
          setIsUpdating(false);
        });
    }

    if (newValue === title) {
      setIsBeingEdited(false);
      setIsUpdating(false);
    }
  };

  const handleUpdatingInputBlur = () => {
    editTodo(id);
  };

  const handleUpdatingInputPressEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== KeyEvent.Enter && event.key !== KeyEvent.Escape) {
      return;
    }

    event.preventDefault();

    if (event.key === KeyEvent.Enter) {
      editTodo(id);
    }

    if (event.key === 'Escape') {
      setUpdatingInputValue(title);
      setIsBeingEdited(false);
    }
  };

  useEffect(() => {
    if (editableInput.current && isBeingEdited) {
      editableInput.current.focus();
    }
  }, [isBeingEdited]);

  return (
    <li className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          onChange={handleStatusChange}
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      {!isBeingEdited && (
        <span
          className="todo__title"
          onDoubleClick={handleDoubleClickTitle}
        >
          {title}
        </span>
      )}

      {!isBeingEdited && (
        <button
          type="button"
          className="todo__remove"
          onClick={handleDeleteButtonClick}
        >
          ×
        </button>
      )}

      {isBeingEdited && (
        <form>
          <input
            ref={editableInput}
            type="text"
            className="todo__title-field"
            value={updatingInputValue}
            onChange={handleUpdatingInputChange}
            onBlur={handleUpdatingInputBlur}
            onKeyDown={handleUpdatingInputPressEnter}
          />
        </form>
      )}

      <div
        className={cn('modal overlay',
          { 'is-active': isUpdating || isTodosUpdating })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

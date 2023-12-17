/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext, useState, useRef, useEffect,
} from 'react';
import { Todo } from '../../types/Todo';
import { AppContext } from '../TodoContext/TodoContext';
import * as todoService from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todo: Todo;
};

const ENTER = 'Enter';
const ESC = 'Escape';

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, setTodos, setError } = useContext(AppContext);
  const { id, title: initialTitle, completed } = todo;

  const [editTitle, setEditTitle] = useState(initialTitle);
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editNameRef.current) {
      editNameRef.current.focus();
    }
  }, [isEdit]);

  const handleToggleViewChange = () => {
    setTodos(
      todos.map((todoItem) => (todoItem.id === id
        ? { ...todoItem, completed: !completed } : todoItem)),
    );
  };

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditTitle(event.target.value);
  };

  const handleDeleteClick = () => {
    todoService.deleteTodo(id);
    setTodos(todos.filter((todoItem) => todoItem.id !== id));
  };

  const saveTitle = (value: string) => {
    if (!value.trim()) {
      handleDeleteClick(); // Delete the todo if the title is empty

      return;
    }

    if (value.trim() === initialTitle) {
      // Cancel editing if the new title is the same as the old one
      setIsEdit(false);

      return;
    }

    setIsSaving(true);
    const updatedTodo = { ...todo, title: value.trim() };

    todoService
      .updateTodo(updatedTodo)
      .then((updated) => {
        setTodos(
          todos.map((todoItem) => (todoItem.id === updated.id
            ? updated : todoItem)),
        );
      })
      .catch(() => {
        if (value.trim() !== initialTitle) {
          setError(ErrorType.cantUpdateTodo);
        } else {
          setError(ErrorType.cantDeleteTodo);
        }

        setTimeout(() => setError(null), 2000);
      })
      .finally(() => {
        setIsSaving(false);
        setIsEdit(false);
      });
  };

  const handleTodoTitleBlur = () => {
    saveTitle(editTitle);
  };

  const handleTodoTitleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === ENTER) {
      if (editNameRef.current) {
        saveTitle(editNameRef.current.value);
      }
    }

    if (event.key === ESC) {
      setEditTitle(initialTitle);
      setIsEdit(false);
    }

    if (event.key === ESC) {
      setEditTitle(initialTitle);
      setIsEdit(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed: !isEdit && completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={handleToggleViewChange}
          checked={completed}
        />
      </label>

      {!isEdit ? (
        <span
          onDoubleClick={() => {
            setIsEdit(true);
            setEditTitle(initialTitle);
          }}
          className="todo__title"
          data-cy="TodoTitle"
        >
          {initialTitle}
        </span>
      ) : (
        <>
          <form>
            <input
              type="text"
              data-cy="TodoTitleField"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editNameRef}
              onChange={handleTodoTitleChange}
              onKeyUp={handleTodoTitleKeyUp}
              onBlur={handleTodoTitleBlur}
              value={editTitle}
              disabled={isSaving}
            />
          </form>
          {isSaving && (
            <div data-cy="TodoLoader" className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
        </>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="deleteTodo"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

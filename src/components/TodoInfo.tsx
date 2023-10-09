import {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodosContext } from '../context/TodoContext';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { ErrorType } from '../types/Errors';

type TodoInfoProps = {
  todo: Todo;
};

export const TodoInfo = ({ todo }: TodoInfoProps) => {
  const {
    deleteTodo: deleteTodoLocaly,
    handleError,
    saveEditedTodo,
    setIsHeaderFocused,
  } = useContext(TodosContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isInputActive, setIsInputActive] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(todo.id)
      .then(() => {
        deleteTodoLocaly(todo.id);
        setIsHeaderFocused(true);
      })
      .catch(() => handleError(ErrorType.Delete))
      .finally(() => setIsLoading(false));
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const prevCompleted = useRef(todo.completed);

  useEffect(() => {
    if (todo.completed !== prevCompleted.current) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    prevCompleted.current = todo.completed;

    return () => { };
  }, [todo.completed]);

  const handleDoubleClick = () => {
    setIsEdited(true);
    setEditedTitle(todo.title);
    setIsInputActive(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleSavingEditedTodo = () => {
    setIsLoading(true);
    if (editedTitle.length === 0) {
      handleDelete();

      return;
    }

    if (editedTitle === todo.title) {
      setIsEdited(false);
      setIsInputActive(false);
      setIsLoading(false);

      return;
    }

    saveEditedTodo({ ...todo, title: editedTitle.trim() })
      .then(() => {
        setIsLoading(false);
        setIsEdited(false);
        setEditedTitle('');
      })
      .catch(() => {
        setIsLoading(false);
        setIsEdited(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed: !!todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title="todoInput"
          checked={todo.completed}
          onChange={() => {
            setIsLoading(true);
            saveEditedTodo({ ...todo, completed: !todo.completed })
              .then(() => setIsLoading(false));
          }}
        />
      </label>

      {isEdited && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (inputRef.current) {
              inputRef.current.blur();
            }
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            onFocus={() => setIsInputActive(true)}
            onBlur={(event) => {
              handleSavingEditedTodo();
              setEditedTitle(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Escape' && inputRef.current) {
                setIsEdited(false);
                setIsInputActive(false);
                setEditedTitle('');
              }
            }}
            disabled={!isInputActive}
          />
        </form>
      )}

      {!isEdited && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {editedTitle || todo.title}
          </span>
          {
            !isLoading
            && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={handleDelete}
              >
                ×
              </button>
            )
          }
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn({
          'modal overlay': true,
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

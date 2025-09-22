import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodoStatus, updateTodoTitle } from '../../api/todos';
import { ErrorType } from '../../App';

type Props = {
  todo: Todo;
  selectedPostId?: number;
  setSelectedPostId: React.Dispatch<React.SetStateAction<number>>;
  handleTodoDelete: (v: number) => void;
  isLoading: boolean;
  isDeleteAllPressed: boolean;
  setCurrentError: React.Dispatch<React.SetStateAction<ErrorType | ''>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isToggleAllPressed: boolean;
  visibleTodos: Todo[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  selectedPostId,
  setSelectedPostId,
  handleTodoDelete,
  isLoading,
  isDeleteAllPressed,
  setCurrentError,
  setTodos,
  isToggleAllPressed,
  visibleTodos,
}) => {
  const { title, id, completed } = todo;
  const [targetTodoId, setTargetTodoId] = useState(0);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [isCurrentTodoEditing, setIsCurrentTodoEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [targetTodo, setTargetTodo] = useState(false);

  const [isTodoEditing, setIsTodoEditing] = useState(false);

  const handleStatusChange = (todoId: number, status: boolean) => {
    setIsCurrentTodoEditing(true);

    updateTodoStatus(todoId.toString(), status)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === todoId ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setCurrentError(ErrorType.UnableToUpdateTodo);
      })
      .finally(() => {
        setIsCurrentTodoEditing(false);
      });
  };

  const handleTitleChange = (todoId: number, newTitle: string) => {
    if (newTitle === title) {
      setIsTodoEditing(false);

      return;
    }

    if (newTitle !== title && newTitle.length > 0) {
      setTargetTodo(true);

      updateTodoTitle(todoId.toString(), newTitle.trim())
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(currentTodo =>
              currentTodo.id === todoId ? updatedTodo : currentTodo,
            ),
          );
          setIsTodoEditing(false);
        })
        .catch(() => {
          setCurrentError(ErrorType.UnableToUpdateTodo);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .finally(() => {
          setTargetTodo(false);
        });
    }

    if (newTitle.length === 0) {
      setTargetTodo(true);

      deleteTodo(todoId.toString())
        .then(() => {
          setTodos(
            visibleTodos.filter(currentTodo => currentTodo.id !== todoId),
          );
          setIsTodoEditing(false);
        })
        .catch(() => {
          setCurrentError(ErrorType.UnableToDeleteTodo);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .finally(() => {
          setTargetTodo(false);
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleStatusChange(id, completed)}
        />
      </label>

      {isTodoEditing && selectedPostId === id ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            setTargetTodoId(id);
            handleTitleChange(id, currentTitle);
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={currentTitle}
            autoFocus
            onChange={e => setCurrentTitle(e.target.value)}
            onBlur={() => {
              handleTitleChange(id, currentTitle);
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                e.preventDefault();
                setIsTodoEditing(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsTodoEditing(true);
              setSelectedPostId(id);
              setTargetTodoId(todo.id);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              handleTodoDelete(todo.id);
              setTargetTodoId(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isCurrentTodoEditing && todo.id === targetTodoId) ||
            (isLoading && todo.id === targetTodoId) ||
            (isDeleteAllPressed && todo.completed) ||
            (isToggleAllPressed && !todo.completed) ||
            isCurrentTodoEditing ||
            (targetTodo && todo.id === targetTodoId),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

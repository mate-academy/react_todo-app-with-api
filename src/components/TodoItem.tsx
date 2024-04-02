import { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage, Todo } from '../types';
import { deleteTodo, patchTodo } from '../api/todos';
import { TEMP_ITEM_ID } from '../utils';
import {
  InputFieldRefContext,
  IsChangingStatusContext,
  IsDeletingCompletedContext,
  SetErrorMessageContext,
  SetTodosContext,
} from '../Contexts';

type Props = {
  todo: Todo;
  toggledAllCompleted?: boolean | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggledAllCompleted = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);

  const setTodos = useContext(SetTodosContext);
  const inputFieldRef = useContext(InputFieldRefContext);
  const setErrorMessage = useContext(SetErrorMessageContext);
  const isDeletingCompleted = useContext(IsDeletingCompletedContext);
  const isChangingStatus = useContext(IsChangingStatusContext);

  useEffect(() => {
    if (
      todo.id === TEMP_ITEM_ID ||
      (todo.completed && isDeletingCompleted) ||
      (isChangingStatus && todo.completed === toggledAllCompleted)
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todo, toggledAllCompleted, isDeletingCompleted, isChangingStatus]);

  const handleStatusChange = useCallback(
    (todoChanged: Todo) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      patchTodo({
        ...todoChanged,
        completed: !todoChanged.completed,
      })
        .then(patchedTodo => {
          setTodos(prevTodos => {
            return prevTodos.map(prevTodo => {
              return prevTodo.id === patchedTodo.id ? patchedTodo : prevTodo;
            });
          });
        })
        .catch(() => setErrorMessage(ErrorMessage.update))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setTodos, setErrorMessage],
  );

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todoId);
          });
        })
        .catch(() => setErrorMessage(ErrorMessage.delete))
        .finally(() => {
          if (inputFieldRef?.current) {
            inputFieldRef.current.focus();
          }

          setIsLoading(false);
        });
    },
    [setTodos, inputFieldRef, setErrorMessage],
  );

  const handleTodoTitleChange = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedTitle = todoTitle.trim();

      if (!trimmedTitle) {
        setIsLoading(true);
        setErrorMessage(ErrorMessage.noError);

        deleteTodo(todo.id)
          .then(() => {
            setTodos(prevTodos => {
              return prevTodos.filter(prevTodo => prevTodo.id !== todo.id);
            });
            setIsEditing(false);

            if (inputFieldRef?.current) {
              inputFieldRef.current.focus();
            }
          })
          .catch(() => setErrorMessage(ErrorMessage.delete))
          .finally(() => {
            setIsLoading(false);
          });

        return;
      }

      if (trimmedTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      setErrorMessage(ErrorMessage.noError);
      setIsLoading(true);

      patchTodo({
        ...todo,
        title: trimmedTitle,
      })
        .then(patchedTodo => {
          setTodos(prevTodos => {
            return prevTodos.map(prevTodo => {
              return prevTodo.id === patchedTodo.id ? patchedTodo : prevTodo;
            });
          });
          setIsEditing(false);
        })
        .catch(() => setErrorMessage(ErrorMessage.update))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [
      inputFieldRef,
      setErrorMessage,
      todo,
      todoTitle,
      setIsEditing,
      setIsLoading,
      setTodos,
    ],
  );

  const handleTodoTitleChangeCancel = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTodoTitle(todo.title);
        setIsEditing(false);

        return;
      }
    },
    [todo],
  );

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleStatusChange(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleTodoTitleChange}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onBlur={handleTodoTitleChange}
            onChange={e => setTodoTitle(e.target.value)}
            onKeyUp={e => handleTodoTitleChangeCancel(e)}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

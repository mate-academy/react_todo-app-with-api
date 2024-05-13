import { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage, Todo } from '../types';
import { deleteTodo, patchTodo } from '../api/todos';
import { TEMP_ITEM_ID } from '../utils';
import { SetErrorMessageContext, TodosContext } from '../Contexts';

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
  const { todosContext, setTodosContext } = useContext(TodosContext);
  const setErrorMessage = useContext(SetErrorMessageContext);

  const { isChangingStatus, isDeletingCompleted, inputFieldRef } = todosContext;

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

  const startTodoDeletion = useCallback(
    (todoId: number) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      return deleteTodo(todoId).then(() => {
        setTodosContext(prevTodosContext => ({
          ...prevTodosContext,
          todos: prevTodosContext.todos.filter(prevTodo => {
            return prevTodo.id !== todoId;
          }),
        }));
      });
    },
    [setTodosContext, setErrorMessage],
  );

  const startTodoPatching = useCallback(
    (updatedTodo: Todo) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      return patchTodo(updatedTodo).then(patchedTodo => {
        setTodosContext(prevTodosContext => ({
          ...prevTodosContext,
          todos: prevTodosContext.todos.map(prevTodo => {
            return prevTodo.id === patchedTodo.id ? patchedTodo : prevTodo;
          }),
        }));
      });
    },
    [setTodosContext, setErrorMessage],
  );

  const handleStatusChange = useCallback(
    (updatedTodo: Todo) => {
      startTodoPatching({
        ...updatedTodo,
        completed: !updatedTodo.completed,
      })
        .catch(() => setErrorMessage(ErrorMessage.update))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [startTodoPatching, setErrorMessage],
  );

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      startTodoDeletion(todoId)
        .catch(() => setErrorMessage(ErrorMessage.delete))
        .finally(() => {
          if (inputFieldRef?.current) {
            inputFieldRef.current.focus();
          }

          setIsLoading(false);
        });
    },
    [startTodoDeletion, inputFieldRef, setErrorMessage],
  );

  const handleTodoTitleChange = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedTitle = todoTitle.trim();

      if (!trimmedTitle) {
        startTodoDeletion(todo.id)
          .then(() => setIsEditing(false))
          .catch(() => setErrorMessage(ErrorMessage.delete))
          .finally(() => setIsLoading(false));

        return;
      }

      if (trimmedTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      startTodoPatching({
        ...todo,
        title: trimmedTitle,
      })
        .then(() => setIsEditing(false))
        .catch(() => setErrorMessage(ErrorMessage.update))
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setErrorMessage, todo, todoTitle, startTodoDeletion, startTodoPatching],
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

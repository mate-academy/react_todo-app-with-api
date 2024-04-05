import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorList } from '../types/ErrorList';
import { useTodosContext } from '../context/TodoContext';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    processingIds,
    focusInput,
    todos,
    setTodos,
    handleError,
    handleDeleteTodo,
  } = useTodosContext();

  const [queryEditing, setQueryEditing] = useState(todo.title);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const inputTodoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    focusInput();
    if (isEditing && inputTodoRef.current) {
      inputTodoRef.current?.focus();
    }
  }, [isEditing]);

  const handleChecker = async (ItemID: number) => {
    const todosChecker = todos.map(prevItem => {
      if (prevItem.id === ItemID) {
        return {
          ...prevItem,
          completed: !prevItem.completed,
        };
      }

      return prevItem;
    });

    setIsLoading(true);

    const newTodo = {
      ...todo,
      completed: !todo.completed,
    };

    await updateTodo(ItemID, newTodo)
      .then(() => {
        setTodos(todosChecker);
      })
      .catch(() => {
        handleError(ErrorList.UpdateTodo);
      })
      .finally(() => {
        focusInput();
        setIsLoading(false);
      });
  };

  const saveInputValue = () => {
    if (queryEditing.trim()) {
      setIsLoading(true);
      if (queryEditing.trim() === todo.title) {
        setIsEditing(false);
        focusInput();
        setIsLoading(false);
      } else {
        const newTodo = {
          ...todo,
          title: queryEditing.trim(),
        };

        updateTodo(todo.id, newTodo)
          .then(todoValue => {
            setTodos(prevTodos =>
              prevTodos.map(currentTodo =>
                currentTodo.id === todo.id ? todoValue : currentTodo,
              ),
            );
            setIsEditing(false);
            focusInput();
            setQueryEditing(queryEditing.trim());
          })
          .catch(() => {
            handleError(ErrorList.UpdateTodo);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(true);
      deleteTodo(todo.id)
        .then(() => {
          setTodos(todos.filter(item => item.id !== todo.id));
          setIsEditing(false);
          focusInput();
        })
        .catch(() => {
          handleError(ErrorList.DeleteTodo);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleClickKeybord = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      focusInput();
      setIsEditing(false);
      setQueryEditing(todo.title);
    }

    if (event.key === 'Enter') {
      saveInputValue();
    }
  };

  const handleQueryEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryEditing(event.target.value);
  };

  const handleBlurInput = () => {
    saveInputValue();
    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label aria-label="Todo status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChecker(todo.id)}
        />
      </label>
      {isEditing ? (
        <form onSubmit={event => event.preventDefault()}>
          <input
            ref={inputTodoRef}
            onBlur={() => handleBlurInput()}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={queryEditing}
            onKeyUp={handleClickKeybord}
            onChange={handleQueryEditChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            onDoubleClick={() => setIsEditing(!isEditing)}
            className="todo__title"
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            processingIds.includes(todo.id) || todo.id === 0 || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

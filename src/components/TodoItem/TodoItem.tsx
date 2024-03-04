import React, { useContext, useState } from 'react';
import cn from 'classnames';
import {
  deleteTodo,
  updateTodoComplete,
  updateTodoTitle,
} from '../../api/todos';
import { TodosContext } from '../TodosContext/TodosContext';

type Props = {
  title: string;
  id: number;
  completed: boolean;
  setErrorMessage?: (message: string) => void;
  showErrorCallback?: () => void;
  loaderToAll?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  setErrorMessage,
  showErrorCallback,
  loaderToAll,
}) => {
  const [todoLoader, setLoader] = useState(false);
  const { todos, setTodos } = useContext(TodosContext);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleDeleteTodo = (todoId: number) => {
    setLoader?.(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage?.('Unable to delete a todo');
        showErrorCallback?.();
      })
      .finally(() => {
        setLoader?.(false);
      });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value.trimStart());
  };

  const handleToggleComplete = (todoId: number, todoCompleted: boolean) => {
    setLoader?.(true);
    updateTodoComplete(todoId, todoCompleted)
      .then(() => {
        setTodos(
          todos.map(todo => {
            if (todo.id === todoId) {
              return { ...todo, completed: !completed };
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        setErrorMessage?.('Unable to update a todo');
        showErrorCallback?.();
      })
      .finally(() => {
        setLoader?.(false);
      });
  };

  const handleSaveEdit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editedTitle.trim().length === 0) {
      handleDeleteTodo(id);
    } else if (e.key === 'Enter') {
      setLoader(true);
      updateTodoTitle(id, editedTitle)
        .then(() => {
          const editedTodos = todos.map(todo => {
            if (todo.id === id) {
              return { ...todo, title: editedTitle };
            }

            return todo;
          });

          setTodos(editedTodos);
        })
        .catch(() => {
          setErrorMessage?.('Unable to update a todo');
          showErrorCallback?.();
        })
        .finally(() => {
          setEditing(false);
          setLoader(false);
        });
    } else if (e.key === 'Escape') {
      setEditedTitle(title);
      setEditing(!editing);
    }
  };

  const handleOnBlur = () => {
    if (editedTitle.length === 0) {
      handleDeleteTodo(id);
    }

    setEditing(false);
  };

  return (
    <li
      key={id}
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleToggleComplete(id, completed)}
        />
      </label>

      {!editing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditing(!editing)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editedTitle}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={handleOnChange}
          onKeyDown={handleSaveEdit}
          onBlur={handleOnBlur}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === 0 || todoLoader || loaderToAll,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};

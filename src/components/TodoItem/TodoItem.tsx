/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { deleteTodo, updateTodo } from '../../api/todos';
import { TodosContext } from '../../TodoProvider';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    completed,
    title,
    id,
  } = todo;

  const {
    setTodos,
    tempTodo,
    setErrorMessage,
    toDelete,
    setToDelete,
    toToggle,
    setToToggle,
  } = useContext(TodosContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const editInput = useRef<HTMLInputElement>(null);
  const [newTitle, setNewTitle] = useState<string>(title);

  useEffect(() => {
    if (editing) {
      editInput.current?.focus();
    }
  }, [editing]);

  const handleDelete = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(() => setTodos(currTodos => [...currTodos]
        .filter(currTodo => currTodo.id !== id)))
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      })
      .finally(() => {
        setIsLoading(false);
        setToDelete((current: number[]) => [...current]
          .filter((currentId) => currentId !== id));
      });
  };

  const handleEdit = () => {
    setIsLoading(true);

    if (title === newTitle) {
      setEditing(false);
      setIsLoading(false);

      return;
    }

    if (newTitle.trim().length === 0 && editing) {
      handleDelete();

      return;
    }

    const updated = {
      ...todo,
      title: newTitle,
    };

    updateTodo(updated)
      .then(updatedTodo => {
        setTodos(currTodos => {
          const newTodos = [...currTodos];
          const index = newTodos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setEditing(false);
      });
  };

  const handleChangeCheck = () => {
    setIsLoading(true);

    const updated = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updated)
      .then(updatedTodo => {
        setTodos(currTodos => {
          const newTodos = [...currTodos];
          const index = newTodos
            .findIndex(currTodo => currTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setToToggle((current: number[]) => [...current]
          .filter((currentId) => currentId !== id));
      });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (tempTodo) {
      setIsLoading(true);
    }

    if (toDelete.includes(id)) {
      handleDelete();
    }

    if (toToggle.includes(id)) {
      handleChangeCheck();
    }
  }, [toDelete, toToggle]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCheck}
        />
      </label>

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={editInput}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => handleEdit()}
            onKeyUp={(e) => handleKeyUp(e)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
        </>
      )}
      <button
        type="button"
        className="todo__remove"
        data-cy="deleteTodo"
        onClick={() => handleDelete()}
      >
        ×
      </button>
      <div
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

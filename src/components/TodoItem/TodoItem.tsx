import React, { useEffect, useState, useRef } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  isTempLoading?: boolean,
  setTodos?: (todos: Todo[]) => void,
  showError?: (title: string) => void,
  todosToRender?: Todo[],
  toBeCleared?: Todo[],
  isToggleAll?: boolean,
  setIsToggleAll?: (val: boolean) => void,
  todos?: Todo[],
  isSameStatus?: boolean,
  toggleAll?: () => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todos = [],
  isTempLoading,
  setTodos = () => {},
  showError = () => {},
  todosToRender = [],
  toBeCleared,
  isToggleAll,
  setIsToggleAll = () => {},
  isSameStatus = false,
  toggleAll = () => {},
}) => {
  const { completed, title, id } = todo;
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const refInput = useRef<HTMLInputElement>(null);
  const [editTitle, setEditTitle] = useState(title);

  const onDelete = (todoId: number) => {
    setIsLoading(true);

    deleteTodo(todoId)
      .then(() => {
        if (todosToRender) {
          setTodos(todosToRender.filter(item => item.id !== id));
        }
      })
      .catch(() => {
        showError('Unable to delete todo');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    toBeCleared?.forEach(item => {
      if (item.id === id) {
        onDelete(id);
      }
    });
  }, [toBeCleared]);

  const onStatusChange = (todoId: number, todoCompleted = !completed) => {
    setIsLoading(true);
    updateTodo(todoId, { completed: todoCompleted }).then(() => {
      if (!isToggleAll) {
        setTodos([...todos].map(item => {
          return item.id === todoId
            ? { ...item, completed: !item.completed }
            : item;
        }));
      }

      if (isToggleAll) {
        toggleAll();
      }
    })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isToggleAll) {
      setIsToggleAll(false);
      if (isSameStatus) {
        onStatusChange(id);
      }

      onStatusChange(id, true);
    }
  }, [isToggleAll]);

  useEffect(() => {
    if (isBeingEdited) {
      refInput.current?.focus();
    }
  }, [isBeingEdited]);

  const edit = () => {
    setIsBeingEdited(false);
    if (title === editTitle) {
      return;
    }

    if (editTitle === '') {
      onDelete(id);

      return;
    }

    setIsLoading(true);

    updateTodo(id, { title: editTitle })
      .then(() => {
        setTodos([...todos.map(item => {
          return item.id === id
            ? { ...item, title: editTitle }
            : item;
        })]);
      })
      .catch(() => {
        showError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onEscape = (key: string) => {
    if (key === 'Escape') {
      setIsBeingEdited(false);
      setEditTitle(title);
    }
  };

  return (
    <div
      className={`todo${completed ? ' completed' : ''}`}
      onDoubleClick={() => setIsBeingEdited(true)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onStatusChange(id)}
        />
      </label>

      {isBeingEdited
        ? (
          <form
            className="todo__title-form"
            onSubmit={(e) => {
              e.preventDefault();
              edit();
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editTitle}
              ref={refInput}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => edit()}
              onKeyUp={(e) => onEscape(e.key)}
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      {(isTempLoading || isLoading) && (
        <>
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
          </div>
          <Loader />
        </>
      )}
    </div>
  );
};

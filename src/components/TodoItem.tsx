import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';
import { PageContext } from '../utils/GlobalContext';
import { deleteTodo, patchTodo } from '../api/todos';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
  },
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const trimedNewTitle = newTitle.trim();
  const editTitleRef = useRef<HTMLInputElement>(null);
  const {
    setTodoList,
    todoList,
    setError,
    setIsLoading,
    isLoading,
    inLoadingTodos,
  } = useContext(PageContext);

  useEffect(() => {
    if (editing) {
      editTitleRef.current?.focus();
    }
  }, [editing]);

  const handleCompleted = () => {
    const updatedTodos = todoList.map(todo => {
      if (todo.id === id) {
        if (completed) {
          return {
            ...todo,
            completed: false,
          };
        }

        return {
          ...todo,
          completed: true,
        };
      }

      return todo;
    });

    setIsLoading(true);
    inLoadingTodos.push(id);
    patchTodo(id, title, !completed)
      .then(() => setTodoList(updatedTodos))
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setIsLoading(false);
        inLoadingTodos.splice(0);
      });
  };

  const handleNewTitle = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (trimedNewTitle === title) {
      setEditing(false);

      return;
    }

    if (!trimedNewTitle) {
      setIsLoading(true);
      inLoadingTodos.push(id);
      deleteTodo(id)
        .then(() => {
          setTodoList(todoList.filter((todo: Todo) => todo.id !== id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setIsLoading(false);
          inLoadingTodos.splice(0);
        });
    } else {
      setIsLoading(true);
      inLoadingTodos.push(id);
      patchTodo(id, trimedNewTitle, completed)
        .then(() => setTodoList(todoList.map(todo => {
          if (todo.id === id) {
            return {
              ...todo,
              title: trimedNewTitle,
            };
          }

          return todo;
        })))
        .catch(() => setError('Unable to update a todo'))
        .finally(() => {
          setIsLoading(false);
          inLoadingTodos.splice(0);
        });
    }

    setEditing(false);
  };

  const cancelNewTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setEditing(false);
    }
  };

  const deleteCurrentTodo = () => {
    setIsLoading(true);
    inLoadingTodos.push(id);
    deleteTodo(id)
      .then(() => {
        setTodoList(todoList.filter((todo: Todo) => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setIsLoading(false);
        inLoadingTodos.splice(0);
      });
  };

  const handlerIsEditing = () => {
    setEditing(true);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        { completed },
        'todo',
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={id.toString()}
          checked={completed}
          onChange={handleCompleted}
        />
      </label>
      {editing
        ? (
          <form onSubmit={handleNewTitle}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleNewTitle}
              onKeyUp={cancelNewTitle}
              ref={editTitleRef}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handlerIsEditing}
            >
              {title}
            </span>

            <button
              aria-label="deleteTodo"
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteCurrentTodo}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={classNames(
          { 'is-active': (isLoading && inLoadingTodos.includes(id)) },
          'modal',
          'overlay',
        )}

      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

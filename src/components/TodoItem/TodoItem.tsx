import { useContext, useEffect, useRef, useState } from 'react';
import cl from 'classnames';
import { Todo } from '../../types/Todo';
import {
  deleteTodo,
  updateCompletedTodo,
  updateTitleTodo,
} from '../../api/todos';
import { Context } from '../constext';
import '../../styles/todo.scss';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    notifyError,
    setTodos,
    forRemove,
    setForRemove,
    hasToggle,
    setHeaToggle,
    activeTodos,
  } = useContext(Context);

  const [isUpdate, setIsUpdate] = useState(false);
  const [hasLoader, setHasLoader] = useState(() => {
    if (!todo.id) {
      return true;
    }

    return false;
  });
  const [value, setValue] = useState(todo.title);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  });

  const removeTodo = () => {
    if (hasLoader) {
      return null;
    }

    setHasLoader(true);

    return deleteTodo(todo.id)
      .then(() => {
        setTodos(prevTodos => {
          const newTodos = [...prevTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1);

          return newTodos;
        });
      })
      .catch(() => {
        notifyError('Unable to delete a todo');
      })
      .finally(() => setHasLoader(false));
  };

  const toggleTodo = () => {
    if (hasLoader) {
      return null;
    }

    let isCompleted = !todo.completed;

    if (hasToggle) {
      isCompleted = activeTodos.length !== 0;
    }

    if (isCompleted === todo.completed) {
      return null;
    }

    setHasLoader(true);

    return updateCompletedTodo(todo.id, isCompleted)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(t => {
            if (t.id === todo.id) {
              return { ...t, completed: isCompleted };
            }

            return t;
          }),
        );
      })
      .catch(() => notifyError('Unable to update a todo'))
      .finally(() => setHasLoader(false));
  };

  function esc() {
    setIsUpdate(false);
    setValue(todo.title);
  }

  if (forRemove.includes(todo.id)) {
    removeTodo()?.then(() => {
      setForRemove(prevForRemove => {
        const newForRemove = [...prevForRemove];
        const index = newForRemove.indexOf(todo.id);

        newForRemove.splice(index, 1);

        return newForRemove;
      });
    });
  }

  if (hasToggle) {
    toggleTodo()?.then(() => setHeaToggle(false));
  }

  const handleDoubleClick = () => {
    setIsUpdate(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const updateTodo = () => {
    if (hasLoader) {
      return null;
    }

    const workValue = value.trim();

    if (workValue === todo.title) {
      esc();

      return null;
    }

    if (!workValue) {
      removeTodo();

      return null;
    }

    setHasLoader(true);

    return updateTitleTodo(todo.id, workValue)
      .then(() => {
        setIsUpdate(false);
        setTodos(prevTodos =>
          prevTodos.map(t => {
            if (t.id === todo.id) {
              return { ...t, title: workValue };
            }

            return t;
          }),
        );
      })
      .catch(() => notifyError('Unable to update a todo'))
      .finally(() => setHasLoader(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTodo();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      esc();
    }
  };

  return (
    <div data-cy="Todo" className={cl('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={toggleTodo}
        />
      </label>

      {!isUpdate ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={removeTodo}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            onChange={handleChange}
            onBlur={updateTodo}
            ref={ref}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cl('modal', 'overlay', { 'is-active': hasLoader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

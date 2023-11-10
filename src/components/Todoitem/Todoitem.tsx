import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos, updateTodo, updateTodoTitle } from '../../api/todos';
import { Errors } from '../../types/Error';
import { Toggler } from '../../types/toggle';
/* eslint-disable max-len */

interface Props {

  todo: Todo,
  todos: Todo[],
  setTodos: (newTodos: Todo[] | ((prevValue: Todo[]) => Todo[])) => void
  setError: (value: string) => void,
  cleared: boolean
  toggled: string
  titleField: React.MutableRefObject<HTMLInputElement | null>;

}

export const Todoitem: React.FC<Props> = ({
  todo, todos, setTodos, setError, cleared, toggled, titleField,
}) => {
  const titleField2 = useRef<HTMLInputElement>(null);
  const [loader, setloader] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  let editError = false;
  let editUerror = false;

  const handleDelete = (id: number | undefined) => {
    if (id) {
      setloader(true);
      deleteTodos(id)
        .then(() => {
          setTodos(todos.filter(stodo => stodo.id !== id));
          if (titleField.current) {
            titleField.current.focus();
          }
        })
        .catch(() => setError(Errors.unableDelete))
        .finally(() => setloader(false));
    }
  };

  useEffect(() => {
    if (titleField2.current) {
      titleField2.current.focus();
    }
  }, [editing]);

  const hadleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const check = title;

    if (todo.id && check.trim() === '') {
      setloader(true);

      deleteTodos(todo.id)
        .then(() => {
          setTodos((prevtodos) => prevtodos.filter(stodo => stodo.id !== todo.id));
          editError = false;
        })
        .catch(() => {
          setError(Errors.unableDelete);
          editError = true;
        })
        .finally(() => {
          setloader(false);

          if (editError === false) {
            setEditing(false);
          }

          if (titleField2.current) {
            titleField2.current.focus();
          }

          if (editError === true) {
            setEditing(true);
          }
        });
    }

    if (todo.id && todo.title !== title.trim() && title.trim() !== '') {
      setloader(true);
      updateTodoTitle(todo.id, { userId: 11843, completed: todo.completed, title: title.trim() }).then(
        (ttodo) => {
          const tTodos = [...todos];
          const index = tTodos.findIndex(tTodo => tTodo.id === todo.id);

          tTodos.splice(index, 1, ttodo);
          setTodos([...tTodos]);
          editUerror = false;
        },
      ).catch(() => {
        setError(Errors.unablechange);
        editUerror = true;
      }).finally(() => {
        setloader(false);

        if (editUerror === false) {
          setEditing(false);
        }

        if (titleField2.current) {
          titleField2.current.focus();
        }

        if (editUerror === true) {
          setEditing(true);
        }
      });
    }

    if (title.trim() === todo.title) {
      setEditing(false);
    }
  };

  const handleCheck = (id: number | undefined, htodo: Todo) => {
    if (id) {
      setloader(true);

      updateTodo(id, { completed: !todo.completed })
        .then(
          (rtodo) => {
            const uTodos = [...todos];
            const index = uTodos.findIndex(uTodo => uTodo.id === htodo.id);

            uTodos.splice(index, 1, rtodo);
            setTodos([...uTodos]);
          },
        ).catch(() => setError(Errors.unablechange)).finally(() => setloader(false));
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          onChange={() => handleCheck(todo.id, todo)}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {!editing

        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setEditing(true);
                setTitle(todo.title);
              }}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          </>
        )
        : (

          <form onSubmit={hadleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              ref={titleField2}
              onChange={(event) => setTitle(event.target.value)}
              // onKeyUp={handleKeyUp}
              onBlur={(event) => {
                hadleSubmit(event);
              }}
              onKeyUp={handleKeyUp}
            />
          </form>
        )}
      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (loader)
            || (cleared && todo.completed)
            || (toggled === Toggler.completed && !todo.completed)
            || (toggled === Toggler.incompleted && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

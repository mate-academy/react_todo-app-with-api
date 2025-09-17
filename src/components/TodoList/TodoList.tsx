import { ErrorType, LoadedTodo, Todo } from '../../types/Types';
import classNames from 'classnames';
import { deleteTodo, updateTodo } from '../../api/todos';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  loadedTodo: LoadedTodo;
  tempTodo: Todo | null;
  deletedTodo: number | null;
  setDeletedTodo: React.Dispatch<React.SetStateAction<number | null>>;
  setLoadedTodo: React.Dispatch<React.SetStateAction<LoadedTodo>>;
  selectedFocus: string;
  setSelectedFocus: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  loadedTodo,
  tempTodo,
  deletedTodo,
  setDeletedTodo,
  setLoadedTodo,
  selectedFocus,
  setSelectedFocus,
}) => {
  const editedRef = useRef<HTMLInputElement>(null);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [title, setTitle] = useState('');

  const handleDelete = (id: number) => {
    setDeletedTodo(id);
    setSelectedFocus('input');

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        setDeletedTodo(null);
      })

      .catch(() => {
        setError(ErrorType.CantDelete);
      });
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditedId(null);
      }
    };

    // Подписка на событие
    window.addEventListener('keydown', handleEscape);

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (selectedFocus === 'edited') {
      editedRef.current?.focus();
    }
  }, [editedId, selectedFocus]);

  const handleSubmit = (id: number, e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setSelectedFocus('edited');

    const trimmed = title.trim();

    const editedTodo = todos.find(todo => todo.id === id);

    if (trimmed === editedTodo?.title) {
      setEditedId(null);

      return;
    }

    if (trimmed.length === 0) {
      setSelectedFocus('input');
      setLoadedTodo({ id: id, isLoad: true, all: false });
      setDeletedTodo(id);

      deleteTodo(id)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== id));

          setDeletedTodo(null);
        })

        .catch(() => {
          setSelectedFocus('edited');
          setError(ErrorType.CantDelete);
        });

      return;
    }

    setLoadedTodo({ id: id, isLoad: true, all: false });
    updateTodo(id, { title: trimmed })
      .then(updatedTodo => {
        // обновляем стейт
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
          ),
        );

        setEditedId(null);
      })
      .catch(() => {
        setError(ErrorType.CantUpdate);

        const timer = setTimeout(() => setError(ErrorType.None), 3000);

        return () => clearTimeout(timer);
      })

      .finally(() => {
        setLoadedTodo({ isLoad: false, id: null, all: false });
      });
  };

  const handleDobleClick = (e: Todo) => {
    setEditedId(e.id);
    setTitle(e.title);
    setSelectedFocus('edited');
  };

  const handleCheckClick = (id: number, status: boolean) => {
    setLoadedTodo({ id: id, isLoad: true, all: false });

    updateTodo(id, { completed: !status })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === id
              ? { ...todo, completed: updatedTodo.completed }
              : todo,
          ),
        );
        setEditedId(null);
      })
      .catch(() => {
        setError(ErrorType.CantUpdate);

        const timer = setTimeout(() => setError(ErrorType.None), 3000);

        return () => clearTimeout(timer);
      })

      .finally(() => {
        setLoadedTodo({ isLoad: false, id: null, all: false });
      });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos.map(todo => (
        <div
          data-cy="Todo"
          className={classNames({
            'todo completed': todo.completed,
            'todo item-enter-done': !todo.completed,
          })}
          key={todo.id}
          onDoubleClick={() => handleDobleClick(todo)}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onClick={() => handleCheckClick(todo.id, todo.completed)}
            />
          </label>

          {editedId === todo.id ? (
            <form onSubmit={e => handleSubmit(todo.id, e)}>
              <input
                ref={editedRef}
                type="text"
                data-cy="TodoTitleField"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={() => handleSubmit(todo.id)}
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditedId(todo.id)}
            >
              {todo.title}
            </span>
          )}

          {/* Remove button appears only on hover */}

          {!editedId && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo.id)}
            >
              ×
            </button>
          )}

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay ', {
              'is-active':
                (loadedTodo.isLoad && loadedTodo.id === todo.id) ||
                deletedTodo === todo.id ||
                loadedTodo.all,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}

      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames({
            'todo completed': tempTodo.completed,
            'todo item-enter-done': !tempTodo.completed,
          })}
          key={tempTodo.id}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              defaultChecked={tempTodo.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(tempTodo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', { 'is-active': loadedTodo })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

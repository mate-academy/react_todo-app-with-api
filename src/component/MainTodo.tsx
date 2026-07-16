import { Todo } from '../types/Todo';
import * as React from 'react';
import cn from 'classnames';
import { useState, useEffect, useRef } from 'react';

type Props = {
  todos: Todo[];
  filteredTodos: Todo[];
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number | null;
  handleUpdateTodo: (t: Todo) => Promise<Todo>;
  loading: boolean;
};

export const MainTodo: React.FC<Props> = ({
  todos: todos,
  filteredTodos,
  deleteTodo,
  tempTodo,
  loadingTodoId,
  handleUpdateTodo,
  loading,
}) => {
  const [upDateTitle, setUpDateTitle] = useState<string>('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const skipNextBlurRef = useRef(false);

  useEffect(() => {
    if (editingTodoId !== null) {
      inputRef.current?.focus();
    }
  }, [editingTodoId]);

  const cancel = () => {
    setEditingTodoId(null);
    setUpDateTitle('');
  };

  const save = async (todo: Todo) => {
    const newTitle = upDateTitle.trim();

    try {
      if (newTitle === '') {
        await deleteTodo(todo.id);
      } else if (newTitle !== todo.title) {
        await handleUpdateTodo({ ...todo, title: newTitle });
      }

      setEditingTodoId(null);
      setUpDateTitle('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, todo: Todo) => {
    if (e.key === 'Escape') {
      cancel();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      skipNextBlurRef.current = true;
      save(todo);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, todo: Todo) => {
    if (skipNextBlurRef.current) {
      skipNextBlurRef.current = false;

      return;
    }

    e.preventDefault();
    save(todo);
  };

  return (
    <section
      className={cn(
        'todoapp__main',
        ((todos.length === 0 && !tempTodo) || loading) && 'hidden',
      )}
      data-cy="TodoList"
    >
      {filteredTodos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() =>
                handleUpdateTodo({ ...todo, completed: !todo.completed })
              }
            />
          </label>
          {editingTodoId === todo.id ? (
            <input
              data-cy="TodoTitleField"
              value={upDateTitle}
              ref={inputRef}
              className="todo__title-field"
              onBlur={e => handleBlur(e, todo)}
              onKeyDown={e => onKeyDown(e, todo)}
              onChange={e => setUpDateTitle(e.target.value)}
            />
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setEditingTodoId(todo.id);
                setUpDateTitle(todo.title);
              }}
            >
              {todo.title}
            </span>
          )}
          {editingTodoId !== todo.id && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          )}
          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': loadingTodoId === todo.id,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          key="tempTodo"
          data-cy="Todo"
          className={cn('todo', {
            completed: tempTodo.completed,
          })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {}}
          >
            ×
          </button>
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

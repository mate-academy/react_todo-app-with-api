import React, { useCallback, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import '../styles/todo.scss';

type Props = {
  todos: Todo[];
  updateTodo: (todo: Todo) => void;
  deleteTodo: (id: number, todo: Todo) => void;
  editing: Todo | null;
  setEditing: (todo: Todo | null) => void;
  loadingTodo: boolean;
  setActiveTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeTodos: Todo[] | null;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  editing,
  setEditing,
  loadingTodo,
  setActiveTodos,
  activeTodos,
  tempTodo,
}) => {
  const [editedValue, setEditedValue] = useState('');

  const onSubmit = useCallback(
    (currentTodo: Todo) => {
      if (currentTodo.title !== editedValue) {
        updateTodo({ ...currentTodo, title: editedValue.trim() });
      } else {
        setEditing(null);
        setActiveTodos([]);
        setEditedValue('');
      }
    },
    [editedValue, setActiveTodos, updateTodo, setEditing],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={classNames('todo', {
              completed: todo.completed === true,
            })}
            onDoubleClick={e => {
              e.preventDefault();
              setEditing(todo);
              setEditedValue(todo.title);
            }}
          >
            <label
              htmlFor={`checkbox-${todo.id}`}
              className="todo__status-label"
            >
              <input
                data-cy="TodoStatus"
                type="checkbox"
                id={`checkbox-${todo.id}`}
                className="todo__status"
                checked={todo.completed}
                aria-label="Completed"
                onChange={() => {
                  updateTodo({ ...todo, completed: !todo.completed });
                }}
              />
            </label>

            {todo.id === editing?.id ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  onSubmit(todo);
                }}
              >
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={editedValue}
                  onBlur={() => onSubmit(todo)}
                  onChange={e => setEditedValue(e.target.value)}
                  onKeyUp={e => {
                    if (e.key === 'Escape') {
                      setEditing(null);
                      setActiveTodos([]);
                      setEditedValue('');
                    }
                  }}
                  autoFocus
                />
              </form>
            ) : (
              <>
                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id, todo)}
                >
                  ×
                </button>
              </>
            )}

            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active':
                  (loadingTodo &&
                    activeTodos?.some(
                      activeTodo => activeTodo.id === todo.id,
                    )) ||
                  todo.id === tempTodo?.id,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div key={tempTodo.id} data-cy="Todo" className="todo">
          <label
            htmlFor={`checkbox-${tempTodo.id}`}
            className="todo__status-label"
          >
            <input
              data-cy="TodoStatus"
              type="checkbox"
              aria-label="Completed"
              id={`checkbox-${tempTodo.id}`}
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};

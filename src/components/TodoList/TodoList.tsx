import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  changeTodoStatus: (id: number, status: boolean) => void,
  isLoading: boolean,
  deleteTodo: (id: number) => void
  updateTitle: (id: number, title: string) => void,
};

export const TodoList: React.FC<Props> = (props) => {
  const {
    todos,
    changeTodoStatus,
    isLoading,
    deleteTodo,
    updateTitle,
  } = props;

  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [allowedToEditId, setAllowedToEditId] = useState<number | null>(null);

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const changeTitle = (todoId: number) => {
    if (newTitle) {
      updateTitle(todoId, newTitle);
    } else {
      deleteTodo(todoId);
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <div
          key={todo.id}
          data-cy="Todo"
          className={cn('todo', { completed: todo.completed })}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              onChange={() => {
                changeTodoStatus(todo.id, todo.completed);
                setSelectedTodoId(todo.id);
              }}
            />
          </label>
          {allowedToEditId === todo.id ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                changeTitle(todo.id);
                setAllowedToEditId(null);
                setSelectedTodoId(todo.id);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
              />
            </form>
          ) : (
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setAllowedToEditId(todo.id);
                setNewTitle(todo.title);
              }}
            >
              {todo.title}
            </span>
          )}

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => {
              deleteTodo(todo.id);
              setSelectedTodoId(todo.id);
            }}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': isLoading && todo.id === selectedTodoId,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};

import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  onDelete: (todoId: number) => void;
  tempTodo: Todo | null,
  todoStatus:(todoId: number) => void;
  changeTodoTitle:(todoId: number, newTitleTodo: string) => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  onDelete = () => {},
  tempTodo,
  todoStatus = () => {},
  changeTodoTitle = () => {},
}) => {
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [doubleClicked, setDoubleClicked] = useState(false);

  function setNewTodoTitle(todoId: number, currentTitle: string) {
    setEditingTodo(todoId);
    setNewTitle(currentTitle);
    setDoubleClicked(true);
  }

  function handleEditSubmit(event: React.FormEvent, todoId: number) {
    event.preventDefault();
    if (newTitle === '') {
      onDelete(todoId);
    } else {
      changeTodoTitle(todoId, newTitle);
    }

    setEditingTodo(null);
  }

  function handleEditBlur(todoId: number) {
    if (newTitle === '') {
      onDelete(todoId);
    } else {
      changeTodoTitle(todoId, newTitle);
    }

    setEditingTodo(null);
    setDoubleClicked(false);
  }

  function handleEditKey(event: React.KeyboardEvent, todoId: number) {
    if (event.key === 'Escape') {
      setNewTitle('');
      setEditingTodo(null);
    }

    if (event.key === 'Enter') {
      changeTodoTitle(todoId, newTitle);
    }
  }

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <div
          className={classNames('todo', {
            completed: todo.completed,
          })}
          key={todo.id}
        >
          {editingTodo === todo.id ? (
            <>
              <label
                className="todo__status-label"
              >
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo.id)}
                />
              </label>
              <form onSubmit={(event) => handleEditSubmit(event, todo.id)}>
                <input
                  type="text"
                  className="todo__title-field"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={(e) => {
                    if (e.relatedTarget === null) {
                      handleEditBlur(todo.id);
                    }
                  }}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={doubleClicked}
                  onKeyUp={(e) => handleEditKey(e, todo.id)}
                />
              </form>
            </>
          ) : (
            <>
              <label
                className="todo__status-label"
              >
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo.id)}
                />
              </label>

              <span
                className="todo__title"
                onDoubleClick={() => setNewTodoTitle(todo.id, todo.title)}
              >
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => onDelete(todo.id)}
              >
                ×
              </button>
            </>
          )}

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          className={classNames('todo', 'loading', 'modal', 'is-active')}
          key={tempTodo.id}
        >
          <div className="loader" />
        </div>
      )}
    </section>
  );
};

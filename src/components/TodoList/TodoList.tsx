import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  changeTodoStatus: (id: number, status: boolean) => void,
  isLoading: boolean,
  deleteTodo: (id: number) => void
  updateTitle: (id: number, title: string) => void,
  isAllCheckedLoading: boolean;
};

export const TodoList: React.FC<Props> = React.memo((props) => {
  const {
    todos,
    changeTodoStatus,
    isLoading,
    deleteTodo,
    updateTitle,
    isAllCheckedLoading,
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

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setAllowedToEditId(null);
      }
    });
  }, []);

  const changeTitleHandler = (todoId: number, title: string) => {
    if (newTitle && title !== newTitle) {
      updateTitle(todoId, newTitle);
    }

    if (!newTitle) {
      deleteTodo(todoId);
    }

    setAllowedToEditId(null);
    setSelectedTodoId(todoId);
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
                changeTitleHandler(todo.id, todo.title);
              }}
            >
              <input
                data-cy="TodoTitleField"
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onBlur={() => changeTitleHandler(todo.id, todo.title)}
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
                setSelectedTodoId(null);
              }}
            >
              {todo.title}
            </span>
          )}
          {allowedToEditId !== todo.id && (
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
          )}

          <div
            data-cy="TodoLoader"
            className={cn('modal overlay', {
              'is-active': (
                (
                  isLoading
                  && todo.id === selectedTodoId
                  && !isAllCheckedLoading
                )
                || (
                  isLoading
                  && todo.completed
                  && isAllCheckedLoading
                )),
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
});

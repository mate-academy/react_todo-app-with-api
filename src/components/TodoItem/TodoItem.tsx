import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isUpdating: number[];
  updateTodo: (todo: Todo) => void;
  removeTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isUpdating,
  updateTodo = () => {},
  removeTodo = () => {},
}) => {
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isTodoEdit, setIsTodoEdit] = useState(false);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  }, [isTodoEdit]);

  const showEditTodoForm = () => {
    setTodoTitle(todo.title);
    setIsTodoEdit(true);
  };

  const hideEditTodoForm = () => {
    setTodoTitle('');
    setIsTodoEdit(false);
  };

  const editTodoOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = todoTitle.trim();

    if (trimmedTitle === todo.title) {
      hideEditTodoForm();

      return;
    }

    if (trimmedTitle) {
      updateTodo({
        ...todo,
        title: trimmedTitle,
      });
    } else {
      removeTodo(todo.id);
    }
  };

  const onTodoKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      hideEditTodoForm();
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
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo)}
        />
      </label>

      {isTodoEdit ? (
        <form onSubmit={editTodoOnSubmit} onBlur={editTodoOnSubmit}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={({ target }) => setTodoTitle(target.value)}
            onKeyUp={onTodoKeyUp}
            ref={todoInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={showEditTodoForm}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => removeTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || isUpdating.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

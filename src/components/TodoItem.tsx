/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-shadow */
import classNames from 'classnames';
import { FocusEvent, FormEvent, useState } from 'react';
import { useTodoContext } from '../hooks/useTodoContext';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onProcessed: boolean,
};

type Edit = FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>;

const TodoItem = ({ todo, onProcessed }: Props) => {
  const {
    onDeleteTodo,
    onUpdateStatus,
    onUpdateTitle,
  } = useTodoContext();
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [updating, setUpdating] = useState(false);

  const handleDeleteTodo = (todoId: number) => {
    onDeleteTodo(todoId);
  };

  const handleChangeStatus = (todo: Todo) => {
    onUpdateStatus(todo);
  };

  const handleEditTitle = (event: Edit) => {
    event.preventDefault();

    if (todoTitle === todo.title) {
      setUpdating(false);

      return;
    }

    if (!todoTitle.trim()) {
      onDeleteTodo(todo.id);

      return;
    }

    setUpdating(false);
    onUpdateTitle(todo, todoTitle);
  };

  return (
    <div
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleChangeStatus(todo)}
        />
      </label>
      {updating
        ? (
          <form onSubmit={handleEditTitle}>
            <input
              type="text"
              className="todoapp__edit-todo"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              autoFocus
              onChange={e => setTodoTitle(e.target.value)}
              onBlur={handleEditTitle}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setUpdating(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => handleDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': onProcessed,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;

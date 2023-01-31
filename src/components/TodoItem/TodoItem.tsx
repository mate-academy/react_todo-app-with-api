import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  targetTodoId: number | null,
  setTargetTodoId: (todoId: number) => void,
  completedDelete: boolean,
  setChangeTodo: (todo: Todo) => void,
  changeCompleted: boolean,
  setCompletedDelete: (val: boolean) => void,
  changeValueSubmit: (todo: Todo) => void,
  isUpdating: boolean,
  setIsUpdating: (val: boolean) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  targetTodoId,
  setTargetTodoId,
  completedDelete,
  setChangeTodo,
  changeCompleted,
  setCompletedDelete,
  changeValueSubmit,
  isUpdating,
  setIsUpdating,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const submitForm = (event: React.FormEvent, item: Todo) => {
    event.preventDefault();

    const {
      title,
      id,
      userId,
      completed,
    } = item;

    if (title === inputValue.trim() || !inputValue.trim()) {
      setShowInput(false);

      return;
    }

    setIsUpdating(true);
    setTargetTodoId(id);

    const newTodo = {
      id,
      userId,
      title: inputValue.trim(),
      completed,
    };

    changeValueSubmit(newTodo);
    setShowInput(false);
    setInputValue('');
  };

  const closeForm = (event: React.KeyboardEvent, item: Todo) => {
    if (event.key === 'Escape') {
      setShowInput(false);
    }

    if (item.title === inputValue) {
      setShowInput(false);
    }
  };

  const clickToDelete = (todoId: number) => {
    setTargetTodoId(todoId);
    setCompletedDelete(true);
  };

  const addClass = todo.id === targetTodoId
    || (todo.completed && completedDelete)
    || (!todo.completed && changeCompleted)
    || (todo.completed && changeCompleted)
    || (isUpdating && (todo.id === targetTodoId));

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', {
          completed: todo.completed,
        })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => setChangeTodo(todo)}
        />
      </label>

      {!showInput
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setShowInput(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => clickToDelete(todo.id)}
            >
              ×
            </button>
          </>
        ) : (
          <form
            onSubmit={e => submitForm(e, todo)}
            onBlur={() => setShowInput(false)}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              defaultValue={todo.title}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => closeForm(e, todo)}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', {
            'is-active': addClass,
          })
        }
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};

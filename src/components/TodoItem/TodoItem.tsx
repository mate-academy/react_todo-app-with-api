import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  deleteTodo: (id: number) => () => void,
  selectedTodo: Todo | null,
  setSelectedTodo: (todo: Todo) => void,
  updateTodo: (todo: Todo) => void,
  groupSelected: Todo [] | null,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  deleteTodo,
  selectedTodo,
  setSelectedTodo,
  updateTodo,
  groupSelected,
}) => {
  const { title, completed, id } = todo;

  const [isEdit, setIsEdit] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEdit && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handleDeleteItem = (todoId: number) => () => {
    deleteTodo(todoId)();

    setSelectedTodo(todo);
  };

  const handleUpdateTodo = (currentTodo: Todo) => () => {
    const updatedTodo = {
      ...currentTodo,
      completed: !currentTodo.completed,
    };

    updateTodo(updatedTodo);
  };

  const findSelectedId = () => {
    let foundId;

    if (groupSelected) {
      foundId = groupSelected.find(todoId => todoId.id === id);
    }

    return foundId?.id;
  };

  const foundId = findSelectedId();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const preparedTitle = newTitle.trim();

    if (preparedTitle === '') {
      deleteTodo(id)();
    } else {
      const updatedTodo = {
        ...todo,
        title: preparedTitle,
      };

      updateTodo(updatedTodo);
      setIsEdit(false);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
    }
  };

  return (
    <div className={classNames('todo', {
      completed,
    })}
    >
      <label
        className="todo__status-label"

      >
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleUpdateTodo(todo)}
        />
      </label>

      {isEdit
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              ref={inputRef}
              onKeyUp={handleKeyUp}
              onBlur={handleSubmit}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEdit(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteItem(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading && (
          id === foundId || id === 0 || selectedTodo?.id === id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

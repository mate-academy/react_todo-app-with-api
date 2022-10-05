import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  title: string,
  onDelete: (todo: number) => void
  todo: Todo
  isAdding?: boolean
  isLoading?: boolean
  handleUpdateTodo: (todo: Todo) => void
  selectedTodoId: number
  setSelectedTodoId: (id: number) => void
};

export const TodoInfo: React.FC<Props> = ({
  title,
  onDelete,
  todo,
  isAdding,
  isLoading,
  handleUpdateTodo,
  selectedTodoId,
  setSelectedTodoId,
}) => {
  const handleCheck = () => {
    handleUpdateTodo(todo);
  };

  const [isDoubleClicked, setIsDoubleClicked] = useState(false);
  const [newRenamedTodo, setNewRenameTodo] = useState('');
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [selectedTodoId]);

  const handleDoubleClick = () => {
    setIsDoubleClicked(true);
    setSelectedTodoId(todo.id);
    setNewRenameTodo(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setNewRenameTodo(value);
  };

  const updateTitle = (t: Todo) => {
    const currentTodo = t;

    currentTodo.title = newRenamedTodo;
    updateTodo(currentTodo.id, { title: newRenamedTodo });

    setSelectedTodoId(0);
  };

  const handlePressKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsDoubleClicked(false);
    }

    if (event.key === 'Enter') {
      updateTitle(todo);
      setIsDoubleClicked(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { 'todo completed': todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheck}
          defaultChecked
        />
      </label>

      {isDoubleClicked && selectedTodoId === todo.id
        ? (
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              value={newRenamedTodo}
              onChange={handleTitleChange}
              onKeyDown={handlePressKey}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}
      {
        (isAdding || isLoading) && selectedTodoId === todo.id
        && (
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay',
              { 'modal overlay is-active': isAdding || isLoading })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};

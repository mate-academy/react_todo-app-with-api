import classNames from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';

type Props = {
  title: string,
  onDelete: (todo: number) => void
  todo: Todo
  handleUpdateTodo: (todo: Todo) => void
  selectedTodoId: number
  setSelectedTodoId: (id: number) => void
  selectedTodos: number[];
  setSelectedTodos: (todoId: number[]) => void
};

export const TodoInfo: React.FC<Props> = ({
  title,
  onDelete,
  todo,
  handleUpdateTodo,
  selectedTodoId,
  setSelectedTodoId,
  selectedTodos,
  setSelectedTodos,
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

  const updateTitle = async (value: Todo) => {
    setSelectedTodos([value.id]);
    const currentTodo = value;

    currentTodo.title = newRenamedTodo;
    try {
      await updateTodo(currentTodo.id, { title: newRenamedTodo });
      setSelectedTodos([]);
    } finally {
      setSelectedTodoId(0);
    }
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
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          {
            'modal overlay is-active': selectedTodos.includes(todo.id),
          })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

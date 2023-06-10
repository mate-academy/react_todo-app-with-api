import React, { useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  deleteToDo: (userId: number) => void;
  completedTodo: (userId: number) => void;
  setEditableTodo: (editedTodo: Todo) => void;
}

export const MainList: React.FC<Props> = ({
  todo,
  deleteToDo,
  completedTodo,
  setEditableTodo,
}) => {
  const { title, completed, id } = todo;

  const isActiveClass = id === 0 ? 'modal overlay is-active' : 'modal overlay';

  const [editableId, setEditableId] = useState<number>(-1);
  const [todoTitle, setTodoTitle] = useState<string>(title);

  useEffect(() => {
    setEditableTodo({
      id,
      title: todoTitle,
      userId: todo.userId,
      completed: todo.completed,
    });
  }, [todoTitle]);

  const handleClick = () => {
    deleteToDo(id);
  };

  const addCompleted = () => {
    completedTodo(id);
  };

  const handleEdit = () => {
    setEditableId(id);
  };

  const editableTodoTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setEditableId(-1);
    }
  };

  const handleSpanKeyPress = (
    event: React.KeyboardEvent<HTMLSpanElement>,
  ) => {
    if (event.key === 'Enter') {
      handleEdit();
    }
  };

  return (
    <div className={`todo ${completed ? 'completed' : ''}`}>
      <label
        className="todo__status-label"
        onClick={addCompleted}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            addCompleted();
          }
        }}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
        role="button"
        tabIndex={0}
      >
        <input type="checkbox" className="todo__status" />
      </label>

      {!editableId || editableId !== id ? (
        <span
          className="todo__title"
          onClick={handleEdit}
          onKeyDown={handleSpanKeyPress}
          role="button"
          tabIndex={0}
        >
          {todoTitle}
        </span>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={editableTodoTitle}
            onBlur={() => {
              setEditableId(-1);
            }}
            onKeyPress={handleKeyPress}
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            handleClick();
          }
        }}
        tabIndex={0}
      >
        ×
      </button>

      <div className={isActiveClass}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

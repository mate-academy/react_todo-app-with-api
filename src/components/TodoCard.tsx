import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodoItems } from '../api/todos';

type Props = {
  todo: Todo;
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  USER_ID: number;
  updateTodo: (todo: Todo) => void;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  todos,
  deleteTodo,
  setTodos,
  USER_ID,
  updateTodo,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editTitleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editTitleField.current && isEdited) {
      editTitleField.current.focus();
    }
  }, [isEdited]);

  const handleInputBlur = () => {
    setIsEdited(false);
    if (newTitle.trim() !== '' && newTitle !== todo.title) {
      updateTodo({ ...todo, title: newTitle });
    }

    if (newTitle === '') {
      deleteTodo(todo.id);
    }
  };

  const handleInputKeyEvent = (
    event?: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event) {
      if (event.key === 'Enter') {
        handleInputBlur();
      }

      if (event.key === 'Escape') {
        setIsEdited(false);
        setNewTitle(todo.title);
      }
    }
  };

  const handleCheckbox = () => {
    const newTodo: Todo = {
      id: todo.id,
      title: todo.title,
      userId: USER_ID,
      completed: !todo.completed,
    };
    const newTodos = [...todos];
    const index = newTodos.findIndex(currentTodo => (
      currentTodo.id === newTodo.id));

    newTodos.splice(index, 1, newTodo);

    updateTodoItems(newTodo)
      .then(() => setTodos(newTodos));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckbox}
        />
      </label>

      {isEdited ? (
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            ref={editTitleField}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            onKeyUp={handleInputKeyEvent}
            onBlur={handleInputBlur}
          />
        </form>

      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdited(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (todo: Todo, todoIndex: number) => void;
  indexOfTodo: number,
  updateTodoStatus: (todo: Todo, todoIndex: number) => void;
  editedTodo: Todo | null,
  saveTodoChanges: (event: React.FormEvent) => void,
  handleTodoTitleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => void,
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  indexOfTodo,
  updateTodoStatus,
  editedTodo,
  saveTodoChanges,
  handleTodoTitleChange,
  setEditedTodo,
}) => {
  const onRemove = (event: React.MouseEvent) => {
    event.preventDefault();

    deleteTodo(todo, indexOfTodo);
  };

  const onUpdateStatus = (event: React.MouseEvent) => {
    event.preventDefault();

    updateTodoStatus(todo, indexOfTodo);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setEditedTodo(todo);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    handleTodoTitleChange(event, todo.id);
  };

  return (
    <div className={classNames(
      'todo',
      { completed: todo.completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={onUpdateStatus}
        />
      </label>

      {editedTodo ? (
        <form onSubmit={saveTodoChanges}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
            onChange={handleOnChange}
            onBlur={saveTodoChanges}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={onRemove}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
};

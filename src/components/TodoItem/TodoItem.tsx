import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  selectedTodosId: number[];
  newTodoField: React.RefObject<HTMLInputElement>;
  removeTodo: (todoId: number) => void;
  switchTodo: (todoId: number, status: boolean) => void;
  updateTodo: (todoId: number, newData: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    removeTodo,
    switchTodo,
    updateTodo,
    selectedTodosId,
    isAdding,
    newTodoField,
  } = props;

  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  const isLoaderVisible = isAdding
    || ((removeTodo || updateTodo)
      && selectedTodosId?.includes(todo.id));

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleChange]);

  const submitEditedTodo = () => {
    if (!editedTitle) {
      removeTodo(todo.id);
      setIsTitleChange(false);

      return;
    }

    if (todo.title !== editedTitle) {
      updateTodo(todo.id, { title: editedTitle });
    }

    setIsTitleChange(false);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isTitleChange) {
      setIsTitleChange(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => switchTodo(todo.id, !todo.completed)}
        />
      </label>

      {!isTitleChange
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTitleChange(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={submitEditedTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todo__title-field"
              ref={newTodoField}
              placeholder="What needs to be done?"
              disabled={isAdding}
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={submitEditedTodo}
              onKeyDown={cancelEditing}
            />
          </form>
        )}

      {isLoaderVisible && (
        <Loader />
      )}
    </div>
  );
});

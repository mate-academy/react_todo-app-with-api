import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  selectedTodoIds: number[];
  newTodoField: React.RefObject<HTMLInputElement>;
  removeTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, status: boolean) => void;
  updateTodo: (todoId: number, newData: Partial<Todo>) => void;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    removeTodo,
    toggleTodoStatus,
    updateTodo,
    selectedTodoIds,
    isAdding,
    newTodoField,
  } = props;

  const [isEditingTodo, setIsEditingTodo] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const isLoading = isAdding || (selectedTodoIds.includes(todo.id));

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isEditingTodo]);

  const submitEditedTodo = () => {
    if (!editedTitle) {
      removeTodo(todo.id);
      setIsEditingTodo(false);

      return;
    }

    if (todo.title !== editedTitle) {
      updateTodo(todo.id, { title: editedTitle });
    }

    setIsEditingTodo(false);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isEditingTodo) {
      setIsEditingTodo(false);
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
          onClick={() => toggleTodoStatus(todo.id, !todo.completed)}
        />
      </label>

      {!isEditingTodo
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditingTodo(true)}
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
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              placeholder="What needs to be done?"
              disabled={isAdding}
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={submitEditedTodo}
              onKeyDown={cancelEditing}
            />
          </form>
        )}

      <Loader isLoading={isLoading} />
    </div>
  );
});

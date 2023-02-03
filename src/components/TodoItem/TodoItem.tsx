import React, { memo, useEffect, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: Todo,
  deleteTodo: (todoId: number) => Promise<void>,
  changeTodoStatus: (todoId: number, status: boolean) => void,
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  selectedTodoIds: number[],

  newTodoField: React.RefObject<HTMLInputElement>,
  isDeleting: boolean,
  isAdding?: boolean,
}

export const TodoItem: React.FC<Props> = memo(({
  todo,
  deleteTodo,
  changeTodoStatus,
  updateTodo,
  newTodoField,
  isDeleting,
  isAdding,
  selectedTodoIds,
}) => {
  const isChanging = selectedTodoIds.includes(todo.id);
  const isLoading = todo.id === 0 || isDeleting
    || isChanging;
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isTitleChange, setIsTitleChange] = useState(false);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isTitleChange]);

  const submitEditedTodo = () => {
    if (!editedTitle) {
      deleteTodo(todo.id);
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
      setEditedTitle(todo.title);
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => changeTodoStatus(todo.id, !todo.completed)}
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
              onClick={() => deleteTodo(todo.id)}
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

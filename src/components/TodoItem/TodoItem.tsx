import classNames from 'classnames';
import React, { memo, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo,
  onTodoDelete?: (selectedTodoId: number) => void,
  loadingTodosIds?: number[],
  onUpdateTodo?: (todoId: number, dataToUpdate: Partial<Todo>) => Promise<void>,
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onTodoDelete,
  loadingTodosIds,
  onUpdateTodo = () => {},
}) => {
  const [isTodoDeleted, setIsTodoDeleted] = useState(false);
  const [titleQuery, setTitleQuery] = useState(todo.title);
  const [isTodoChanging, setIsTodoChanging] = useState(false);

  const handleDeletedTodo = () => {
    setIsTodoDeleted(true);

    if (onTodoDelete) {
      onTodoDelete(todo.id);
    }
  };

  const handeChangeTodoTitle = () => {
    if (!titleQuery.trim()) {
      handleDeletedTodo();
      setIsTodoChanging(false);

      return;
    }

    if (todo.title !== titleQuery) {
      onUpdateTodo(
        todo.id,
        { title: titleQuery },
      );
      setIsTodoChanging(false);
    }

    setIsTodoChanging(false);
  };

  const handleCancelChangingTodoTitle = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsTodoChanging(false);
    }
  };

  const isLoaderNeeded = todo.id === 0
    || isTodoDeleted
    || loadingTodosIds?.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => onUpdateTodo(
            todo.id,
            { completed: !todo.completed },
          )}
        />
      </label>

      { isTodoChanging ? (
        <form onSubmit={() => handeChangeTodoTitle()}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={titleQuery}
            onChange={(event) => setTitleQuery(event.target.value)}
            onBlur={() => handeChangeTodoTitle()}
            onKeyDown={(event) => handleCancelChangingTodoTitle(event)}
          />
        </form>
      )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsTodoChanging(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={handleDeletedTodo}
            >
              ×
            </button>
          </>
        )}

      {isLoaderNeeded && <Loader />}
    </div>
  );
});

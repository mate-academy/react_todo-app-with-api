import React, { memo, useState, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todo: Todo,
  isTodoAdding?: boolean
  removeTodo: (todoId: number) => void,
  changeTodo:(id: number, itemsToUpdate: Partial<Todo>) => void;
  selectedTodoIds: number[],
  toggleTodo: (id: number, statusTodo: boolean) => void;
};

export const TodoInfo:React.FC<Props> = memo(({
  newTodoField,
  todo,
  removeTodo,
  changeTodo,
  selectedTodoIds,
  isTodoAdding,
  toggleTodo,
}) => {
  const [isChangeTodo, setIsChangeTodo] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isLoading = isTodoAdding || (selectedTodoIds.includes(todo.id));

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [isChangeTodo]);

  const submitChangedTodo = () => {
    if (!newTitle) {
      removeTodo(todo.id);
      setIsChangeTodo(false);

      return;
    }

    if (todo.title !== newTitle) {
      changeTodo(todo.id, { title: newTitle });
    }

    setIsChangeTodo(false);
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isChangeTodo) {
      setIsChangeTodo(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => toggleTodo(todo.id, !todo.completed)}
        />
      </label>
      {!isChangeTodo
        ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsChangeTodo(true)}
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
          <form onSubmit={submitChangedTodo}>
            <input
              data-cy="TodoTitleField"
              type="text"
              ref={newTodoField}
              className="todo__title-field"
              placeholder="What needs to be done?"
              disabled={isTodoAdding}
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={submitChangedTodo}
              onKeyDown={cancelEditing}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

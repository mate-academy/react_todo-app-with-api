import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => void;
  shouldShowLoader: boolean;
  onUpdate: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>)
  => Promise<void>;
};

export const TodoItem: FC<Props> = React.memo((props) => {
  const {
    todo,
    onDelete,
    shouldShowLoader,
    onUpdate,
  } = props;

  const [shouldShowUpdateForm, setShouldShowUpdateForm] = useState(false);

  const stopEditing = useCallback(() => {
    setShouldShowUpdateForm(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    await onUpdate(todo.id, { title });
  }, [todo]);

  const deleteTodoById = useCallback(async () => {
    await onDelete(todo.id);
  }, [todo]);

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
          readOnly
          onClick={() => {
            onUpdate(todo.id, { completed: !todo.completed });
          }}
        />
      </label>

      {shouldShowUpdateForm
        ? (
          <TodoTitleField
            prevTitle={todo.title}
            stopEditing={stopEditing}
            updateTitle={updateTitle}
            deleteTodoById={deleteTodoById}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setShouldShowUpdateForm(true)}
            >
              {todo.title}
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
        className={cn(
          'modal overlay',
          {
            'is-active': todo.id === 0 || shouldShowLoader,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

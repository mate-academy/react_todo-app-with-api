import classNames from 'classnames';
import React, { memo, useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

interface Props {
  todo: Todo,
  onDeleteTodo: (todoId: number) => Promise<void>,
  shouldLoadOnDelete?: boolean,
  onUpdateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
}

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    onDeleteTodo,
    shouldLoadOnDelete,
    onUpdateTodo,
  } = props;

  const [isUpdatingFieldVisible, setIsUpdatingFieldVisible] = useState(false);

  const cancelEditing = useCallback(() => {
    setIsUpdatingFieldVisible(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    if (title.trim()) {
      await onUpdateTodo(todo.id, { title });
    } else {
      onDeleteTodo(todo.id);
    }
  }, [onDeleteTodo, onUpdateTodo, todo.id]);

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
          checked={todo.completed}
          onClick={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isUpdatingFieldVisible
        ? (
          <TodoTitleField
            prevTitle={todo.title}
            cancelEditing={cancelEditing}
            updateTitle={updateTitle}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsUpdatingFieldVisible(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onDeleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 || shouldLoadOnDelete },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

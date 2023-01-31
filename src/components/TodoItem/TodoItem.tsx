import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTotleField } from '../TodoTitleField';

type Props = {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  isDeleting: boolean;
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>;
};

export const TodoItem: FC<Props> = React.memo((props) => {
  const {
    todo,
    onRemoveTodo,
    isDeleting,
    updateTodo,
  } = props;
  const isLoading = todo.id === 0 || isDeleting;

  const [shouldShowInputm, setShouldShowInput] = useState(false);

  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todo.id, { title });
  }, [todo.id]);

  const deleteEmptyTodo = useCallback(async () => {
    await onRemoveTodo(todo.id);
  }, [todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
          onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {shouldShowInputm
        ? (
          <TodoTotleField
            updateTitle={updateTitle}
            cancelEditing={cancelEditing}
            oldTitle={todo.title}
            deleteEmptyTodo={deleteEmptyTodo}
          />
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setShouldShowInput(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => onRemoveTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

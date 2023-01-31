import React, { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';
import { updateTodo } from '../../api/todos';

interface Props {
  todo: Todo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteTodo: (todoId: number) => Promise<any>;
  shouldShowLoader: boolean;
  onUpdateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
}

export const TodoItem: FC<Props> = React.memo(({
  todo,
  onDeleteTodo,
  shouldShowLoader,
  onUpdateTodo,
}) => {
  const isLoading = todo.id === 0 || shouldShowLoader;
  const todoId = todo.id;

  const [shouldShowInput, setShouldShowInput] = useState(false);

  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todoId, { title });
  }, [todoId]);

  const deleteTodoById = useCallback(async () => {
    await onDeleteTodo(todoId);
  }, [todoId]);

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
          onClick={() => onUpdateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {
        shouldShowInput
          ? (
            <TodoTitleField
              oldTitle={todo.title}
              updateTitle={updateTitle}
              cancelEditing={cancelEditing}
              deleteTodo={deleteTodoById}
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
                onClick={() => onDeleteTodo(todo.id)}
              >
                ×
              </button>
            </>
          )
      }

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

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FC,
  memo,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

type Props = {
  todo: Todo,
  isDeleting: boolean,
  onDeleteTodo: (todoId: number) => void,
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  isUpdating: boolean,
};

export const TodoItem: FC<Props> = memo(({
  todo,
  isDeleting,
  onDeleteTodo,
  updateTodo,
  isUpdating,
}) => {
  const isLoading = todo.id === 0 || isDeleting || isUpdating;

  const [shouldShowInput, setShouldShowInput] = useState(false);

  const cancelEditing = useCallback(() => setShouldShowInput(false), []);

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todo.id, { title });
  }, [todo.id]);

  const deleteTodoById = useCallback(async () => {
    await onDeleteTodo(todo.id);
  }, [todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
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
      {shouldShowInput
        ? (
          <TodoTitleField
            deleteTodoById={deleteTodoById}
            updateTitle={updateTitle}
            cancelEditing={cancelEditing}
            oldTitle={todo.title}
          />
        ) : (
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

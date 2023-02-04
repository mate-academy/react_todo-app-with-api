import cn from 'classnames';
import {
  FC, memo, useCallback, useState,
} from 'react';
import { deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from './TodoTitleField';

type Props = {
  todo: Todo
  handleDeleteTodo?: (id: number) => void
  isDelete?: boolean
  updateTodo: (
    todoId: number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
  updatingTodoIds: number[],
};

export const TodoItem: FC<Props> = memo(({
  todo,
  handleDeleteTodo,
  isDelete,
  updateTodo,
  updatingTodoIds,
}) => {
  const { id, title, completed } = todo;
  const [shouldShowInput, setShouldShowInput] = useState(false);

  const handleDeleteClick = () => {
    if (handleDeleteTodo) {
      handleDeleteTodo(id);
    }
  };

  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const updateTitle = useCallback(async (newTitle: string) => {
    await updateTodo(todo.id, { title: newTitle });
  }, [todo.id, updateTodo]);

  const deleteTodoById = useCallback(async () => {
    await deleteTodo(todo.id);
  }, [todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => updateTodo(todo.id, { completed: !completed })}
        />
      </label>

      {
        shouldShowInput
          ? (
            <TodoTitleField
              oldTitle={title}
              cancelEditing={cancelEditing}
              updateTitle={updateTitle}
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
                {title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDeleteButton"
                onClick={handleDeleteClick}
              >
                ×
              </button>
            </>
          )
      }

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal',
          'overlay',
          // eslint-disable-next-line max-len
          { 'is-active': isDelete || id === 0 || updatingTodoIds.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

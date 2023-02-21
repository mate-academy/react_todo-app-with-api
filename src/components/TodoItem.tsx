import { FC, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodoTitleField } from './TodoTitleField';
import { deleteTodos } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo
  onDeleteTodo: (todoId: number) => Promise<void>
  shouldShowLoader: boolean
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>
};

export const TodoItem: FC<Props> = ({
  todo,
  onDeleteTodo,
  shouldShowLoader,
  updateTodo,
}) => {
  const isLoading = todo.id === 0 || shouldShowLoader;
  const [shouldShowInput, setShouldShowInput] = useState(false);

  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const todoId = todo.id;

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todoId, { title });
  }, []);

  const deleteTodoById = useCallback(async () => {
    await deleteTodos(todo.id);
  }, [todoId]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { 'todo completed': todo.completed })}
      key={todo.id}
    >

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {shouldShowInput
        ? (
          <TodoTitleField
            cancelEditing={cancelEditing}
            oldTitle={todo.title}
            updateTitle={updateTitle}
            deleteTodoById={deleteTodoById}
          />
        )

        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                setShouldShowInput(true);
              }}
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

      <Loader isLoading={isLoading} />
    </div>
  )
};

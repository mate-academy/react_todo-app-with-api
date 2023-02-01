import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

type TodoItemProps = {
  todo: Todo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDeleteTodo: (todoId: number) => Promise<any>,
  shouldShowLoader: boolean,
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
};

export const TodoItem: React.FC<TodoItemProps> = ({
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

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todo.id, { title });
  }, [todo.id]);

  const deleteTodo = useCallback(async () => {
    await onDeleteTodo(todo.id);
  }, [todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          readOnly
          onClick={() => updateTodo(todo.id, { completed: !todo.completed })}
        />
      </label>

      {
        shouldShowInput
          ? (
            <TodoTitleField
              cancelEditing={cancelEditing}
              oldTitle={todo.title}
              updateTitle={updateTitle}
              deleteTodo={deleteTodo}
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
        className={cn(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

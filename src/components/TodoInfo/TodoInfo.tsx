import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { UpdateTodoTitle } from '../UpdateTodoTitle/UpdateTodoTitle';

interface TodoInfoProps {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>,
  shouldShowLoader: boolean,
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>,
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
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
      className={classNames(
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
            <UpdateTodoTitle
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
        className={classNames(
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

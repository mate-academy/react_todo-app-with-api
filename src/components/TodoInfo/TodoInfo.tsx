import classNames from 'classnames';
import { memo, useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => void;
  isAdding?: boolean;
  onUpdateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
  shouldShowLoader?: boolean;
};

export const TodoInfo: React.FC<Props> = memo(
  ({
    todo, onDeleteTodo, isAdding, onUpdateTodo, shouldShowLoader,
  }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [shouldShowInput, setShouldShowInput] = useState(false);

    const cancelEditing = useCallback(() => {
      setShouldShowInput(false);
    }, []);

    const updateTitle = useCallback(
      async (title: string) => {
        await onUpdateTodo(todo.id, { title });
      },
      [todo.id],
    );

    const handleUpdateTodo = async (
      todoId: number,
      fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
    ) => {
      setIsLoading(true);

      await onUpdateTodo(todoId, fieldsToUpdate);

      setIsLoading(false);
    };

    const deleteTodoById = useCallback(
      async () => {
        setIsLoading(true);

        await onDeleteTodo(todo.id);

        setIsLoading(false);
      },
      [todo.id],
    );

    return (
      <div
        data-cy="Todo"
        key={todo.id}
        className={classNames('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => (
              handleUpdateTodo(todo.id, { completed: !todo.completed }))}
            defaultChecked
          />
        </label>

        {shouldShowInput ? (
          <TodoTitleField
            oldTitle={todo.title}
            updateTitle={updateTitle}
            cancelEditing={cancelEditing}
            deleteTodo={deleteTodoById}
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
              onClick={deleteTodoById}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading || isAdding || shouldShowLoader,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

import {
  FC,
  memo,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

interface TodoItemProps {
  isUpdatingTodo: boolean;
  todo: Todo;
  deleteTodo: (todoId: number) => Promise<unknown>;
  shouldShowLoader: boolean;
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
}

export const TodoItem: FC<TodoItemProps> = memo(
  ({
    todo,
    deleteTodo,
    shouldShowLoader,
    updateTodo,
    isUpdatingTodo,
  }) => {
    const todoId = todo.id;
    const isLoading = todoId === 0 || shouldShowLoader;

    const [shouldShowInput, setShouldShowInput] = useState(false);

    const cancelEditing = useCallback(() => {
      setShouldShowInput(false);
    }, []);

    const updateTitle = useCallback(async (title: string) => {
      await updateTodo(todoId, { title });
    }, [todoId, updateTodo]);

    const deleteTodobyId = useCallback(async () => {
      await deleteTodo(todoId);
    }, [deleteTodo, todoId]);

    return (
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
        )}
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

        {
          shouldShowInput
            ? (
              <TodoTitleField
                oldTitle={todo.title}
                cancelEditing={cancelEditing}
                updateTitle={updateTitle}
                deleteTodo={deleteTodobyId}
                isUpdatingTodo={isUpdatingTodo}
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
                  onClick={() => deleteTodo(todo.id)}
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
  },
);

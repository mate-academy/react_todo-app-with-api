import { memo, useCallback, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';

type Props = {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  shouldshowLoader: boolean | number[];
  updateTodo: (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => Promise<void>;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    onDeleteTodo,
    shouldshowLoader,
    updateTodo,
  } = props;

  const isLoading = todo.id === 0 || shouldshowLoader;
  const todoId = todo.id;
  const [shouldShowInput, setShouldShowInput] = useState(false);
  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todoId, { title });
  }, [todoId]);

  const deleteTodo = useCallback(async () => {
    await onDeleteTodo(todoId);
  }, [todoId]);

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
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

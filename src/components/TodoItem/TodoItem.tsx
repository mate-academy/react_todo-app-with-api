import React, {
  memo,
  useCallback,
  useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoTitleField } from '../TodoTitleField/TodoTitleField';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  processingTodoIds: number[],
  updateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => Promise<void>,
  isAddingTodo?: boolean,
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo,
    onDeleteTodo,
    processingTodoIds,
    updateTodo,
    isAddingTodo,
  } = props;

  const [shouldShowInput, setShouldShowInput] = useState(false);

  const cancelEditing = useCallback(() => {
    setShouldShowInput(false);
  }, []);

  const updateTitle = useCallback(async (title: string) => {
    await updateTodo(todo.id, { title });
  },
  [todo.id, updateTodo]);

  const deleteTodoById = useCallback(async () => {
    await deleteTodo(todo.id);
  }, [todo.id]);

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', { completed: todo.completed },
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

      {shouldShowInput
        ? (
          <TodoTitleField
            cancelEditing={cancelEditing}
            oldTitle={todo.title}
            updateTitle={updateTitle}
            deleteTodoById={deleteTodoById}
            onDeleteTodo={() => onDeleteTodo(todo.id)}
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
        className={cn('modal overlay', {
          'is-active': processingTodoIds.includes(todo.id) || isAddingTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});

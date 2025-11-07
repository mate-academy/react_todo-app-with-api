/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  selectedTodoId: number | undefined;
  isProcessed: boolean;
  onDelete?: (todoId: number) => void | undefined;
  onUpdateUserTodo?: (todo: Todo) => Promise<Todo> | void;
  inputTodoTitleFieldRef?: React.RefObject<HTMLInputElement>;
  editingTodoId: number | undefined;
  editTitle: string | undefined;
  onBeginEditTitle?: (todo: Todo) => void;
  onSaveEditTitle?: (todoId: number, newTitle: string) => Promise<Todo> | void;
  onCancelEditTitle?: () => void;
  onChangeEditTitle?: (todoId: number, value: string) => void;
};

export const TodoItem = ({
  todo,
  selectedTodoId,
  isProcessed,
  onDelete,
  onUpdateUserTodo,
  inputTodoTitleFieldRef,
  editingTodoId,
  editTitle,
  onBeginEditTitle,
  onSaveEditTitle,
  onCancelEditTitle,
  onChangeEditTitle,
}: Props) => {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      onSaveEditTitle?.(todo.id, (editTitle ?? '').trim());
    } else if (e.key === 'Escape') {
      onCancelEditTitle?.();
    }
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        selected: selectedTodoId === todo.id,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            onUpdateUserTodo?.({ ...todo, completed: !todo.completed })
          }
        />
      </label>

      {editingTodoId === todo.id && (
        <input
          data-cy="TodoTitleField"
          ref={inputTodoTitleFieldRef}
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          type="text"
          value={editTitle ?? ''}
          onChange={e => onChangeEditTitle?.(todo.id, e.target.value)}
          onBlur={() => onSaveEditTitle?.(todo.id, (editTitle ?? '').trim())}
          onKeyDown={handleKeyDown}
        />
      )}

      {editingTodoId !== todo.id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onBeginEditTitle?.(todo)}
        >
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
        <button
          data-cy="TodoDelete"
          type="button"
          className="todo__remove"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <TodoLoader isActive={isProcessed} />
    </div>
  );
};

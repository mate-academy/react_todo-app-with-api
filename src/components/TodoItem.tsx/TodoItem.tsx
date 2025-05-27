/* eslint-disable jsx-a11y/label-has-associated-control */
import { useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
// import { deleteTodos } from '../../api/todos';

interface Props {
  todo: Todo;
  onInputChange: (
    todoId: number,
    change: string,
    value?: HTMLInputElement['value'],
  ) => void;
  onDelete: (todoId: number) => void;
  deletedTodoId: number[];
  setDeletedTodoId: React.Dispatch<React.SetStateAction<number[]>>;
  editingTodoId: number | undefined;
  setEditingTodoId: (value: number | undefined) => void;
  // inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const TodoItem = ({
  todo,
  onInputChange,
  onDelete,
  deletedTodoId,
  setDeletedTodoId,
  editingTodoId,
  setEditingTodoId,
}: Props) => {
  const [titleTodo, setTitleTodo] = useState<string>(todo.title);
  const [renderButton, setRenderButton] = useState<boolean>(true);
  const startTitleRef = useRef<string>('');

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    e.preventDefault();
    onInputChange(todo.id, 'title', titleTodo.trim());
    startTitleRef.current = '';
    setEditingTodoId(undefined);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditingTodoId(undefined);
      setTitleTodo(startTitleRef.current);
      startTitleRef.current = '';
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo item-enter-done', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            setDeletedTodoId(prevIds => [...prevIds, todo.id]);
            onInputChange(todo.id, 'status');
          }}
        />
      </label>

      {editingTodoId !== todo.id ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingTodoId(todo.id);
            setRenderButton(false);
            startTitleRef.current = todo.title;
          }}
        >
          {titleTodo}
        </span>
      ) : (
        <form
          onSubmit={e => {
            // setDeletedTodoId(prevIds => [...prevIds, todo.id]);
            e.preventDefault();
            setRenderButton(true);
            setTitleTodo(prevTitle => prevTitle.trim());

            if (startTitleRef.current === titleTodo.trim()) {
              onInputChange(todo.id, 'title', 'no changes');
            } else {
              onInputChange(todo.id, 'title', titleTodo.trim());
            }
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleTodo}
            autoFocus={true}
            onChange={e => {
              setTitleTodo(e.target.value);
            }}
            onKeyUp={handleKeyUp}
            onBlur={e => {
              handleBlur(e);
              setRenderButton(true);
            }}
          />
        </form>
      )}

      {renderButton && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deletedTodoId.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

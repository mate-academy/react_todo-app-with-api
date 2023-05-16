import React, { useCallback, useState } from 'react';
import clasnames from 'classnames';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  onDelete: (id: number) => void;
  onChangeStatus: (id: number, completed: boolean) => void;
  onSubmitEdited: (id: number, newTitle: string) => void;
};

export const TodoComponent:React.FC<Props> = ({
  todo,
  loadingTodoId,
  onDelete,
  onChangeStatus,
  onSubmitEdited,
}) => {
  const {
    title,
    completed,
    id,
  } = todo;

  const [todoEditText, setTodoEditText] = useState('');
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  const onEditTodo = useCallback(
    (event:React.ChangeEvent<HTMLInputElement>) => {
      setTodoEditText(event.target.value.trim());
    }, [],
  );

  const onChooseTodoToEdit = useCallback(
    (todoId:number) => {
      setEditTodoId(todoId);
      setTodoEditText(todo.title);
    }, [],
  );

  const handleSubmitEdited = useCallback(() => {
    if (todoEditText) {
      onSubmitEdited(id, todoEditText);
    } else {
      onDelete(id);
    }

    setEditTodoId(null);
  }, [todoEditText]);

  const handleEscape = useCallback(
    (event:React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        setEditTodoId(null);
      }
    }, [],
  );

  return (
    <div
      className={clasnames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onChangeStatus(id, !completed)}
        />
      </label>

      {editTodoId === id
        ? (
          <form
            onSubmit={() => handleSubmitEdited()}
            onBlur={() => handleSubmitEdited()}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoEditText}
              onChange={(event) => onEditTodo(event)}
              onKeyUp={(event) => handleEscape(event)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => onChooseTodoToEdit(id)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={clasnames('modal overlay', {
          'is-active': loadingTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

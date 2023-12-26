import {
  FC, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo as TodoTypes } from '../../types/Todo';

type Props = {
  todo: TodoTypes,
  deleteTodo: (id: number) => void,
  Loader: boolean;
  updateTodo: (id: number, newData: Partial<TodoTypes>) => Promise<void>;
};

export const Todo: FC<Props> = ({
  todo,
  deleteTodo,
  Loader,
  updateTodo,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const editTitletRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editTitletRef.current?.focus();
  }, [isEdit]);

  const titleEdit = () => {
    setIsEdit(true);
    setNewTitle(todo.title);
  };

  const saveNewTitle = () => {
    const preparedTitle = newTitle.trim();

    if (!preparedTitle) {
      return;
    }

    if (preparedTitle === todo.title) {
      setIsEdit(false);

      return;
    }

    updateTodo(todo.id, { title: preparedTitle })
      .then(() => {
        setIsEdit(false);
      })
      .catch((e) => {
        throw new Error(e);
      });

    editTitletRef.current?.focus();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveNewTitle();
  };

  const pressKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', { completed: todo.completed })}
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

      {isEdit
        ? (
          <form onSubmit={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onKeyUp={pressKeyUp}
              onBlur={saveNewTitle}
              ref={editTitletRef}
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={titleEdit}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodo(todo.id)}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': Loader },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>

    </div>
  );
};

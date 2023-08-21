import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Loading } from '../Loading';

type Props = {
  todo: Todo;
  deleteTodo: (arg: number) => Promise<void>;
  updateTodo: (arg: number, obj: Partial<Todo>) => void;
  todoblank: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo, deleteTodo, updateTodo, todoblank,
}) => {
  const { id, title, completed } = todo;
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(todoblank);
  const inputRef = useRef<HTMLInputElement>(null);

  const editHandler = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.target.value.trim()) {
      updateTodo(id, { title: e.target.value.trim() });
      setIsUpdate(false);
    } else {
      deleteTodo(id);
    }
  };

  const deleteTodoHandler = () => {
    setIsLoading(true);
    deleteTodo(id).then(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isUpdate && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isUpdate]);

  return (
    <div className={cn('todo', { completed })}>
      {isLoading && <Loading />}
      <label className={cn('todo__status-label', { outline: !completed })}>
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodo(id, { completed: !completed })}
        />
      </label>
      {!isUpdate ? (
        <>
          <span className="todo__title" onDoubleClick={() => setIsUpdate(true)}>
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={deleteTodoHandler}
          >
            ×
          </button>
        </>
      ) : (
        <>
          <form>
            <input
              type="text"
              className="todo__title-field"
              style={{ outline: 'none' }}
              placeholder="Empty todo will be deleted"
              defaultValue={title}
              onBlur={editHandler}
              ref={inputRef}
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
};

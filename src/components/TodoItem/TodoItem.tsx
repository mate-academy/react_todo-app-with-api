import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef } from 'react';

interface Props {
  todo: Todo;
  loader: boolean;
  deletePosts: (todo: Todo) => void;
  addActivePosts: (todo: Todo) => void;
  changeInputs: (todo: Todo, value: string) => void;
  clickTodo: number | null;
  setChangeInput: (value: string) => void;
  changeInput: string;
  setClickTodo: (id: number) => void;
}

export const TodoItem = ({
  todo,
  loader,
  deletePosts,
  addActivePosts,
  changeInputs,
  clickTodo,
  setChangeInput,
  changeInput,
  setClickTodo,
}: Props) => {
  const inputFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (clickTodo !== null && inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [clickTodo]);

  return (
    <div data-cy="Todo" className="todo" key={todo.id}>
      <label className="todo__status-label" aria-labelledby={`todo_${todo.id}`}>
        <input
          id={`todo_${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => {
            addActivePosts(todo);
          }}
        />
      </label>

      {todo.id === clickTodo ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changeInput}
            onChange={event => setChangeInput(event.target.value)}
            ref={inputFocus}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }

              changeInputs(todo, event.key);
            }}
            onBlur={() => changeInputs(todo, 'Blur')}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setChangeInput(todo.title);
            setClickTodo(todo.id);
          }}
        >
          {todo.title}
        </span>
      )}

      {todo.id !== clickTodo && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deletePosts(todo);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

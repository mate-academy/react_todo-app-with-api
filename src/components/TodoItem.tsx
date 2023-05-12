import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo | null;
  loadingTodoIds: number[];
  deleteClickHandler: (
    id: number
  ) => void;
  patchHandlerTodoCompleted: (
    id: number,
    completed: boolean
  ) => void;
  patchHandlerTodoTitle:(
    id: number,
    title: string
  ) => void;
  setLoaderTodo: (loaderTodo: number) => void;
  loaderTodo: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  deleteClickHandler,
  patchHandlerTodoCompleted,
  patchHandlerTodoTitle,
  setLoaderTodo,
  loaderTodo,
}) => {
  const { id, title, completed } = todo || { id: 0 };
  const [clickedForm, setClickedForm] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const changeValueHandler = (event: React.FormEvent<HTMLInputElement>) => {
    setTitleText(event.currentTarget.value);
  };

  const onSubmitFormHandler = (e:React.SyntheticEvent) => {
    e.preventDefault();
    setLoaderTodo(id);
    setClickedForm(false);

    if (titleText) {
      patchHandlerTodoTitle(id, titleText);
    }
  };

  const onBlurHandler = (e:React.SyntheticEvent) => {
    setClickedForm(false);

    if (!titleText) {
      setLoaderTodo(id);
      deleteClickHandler(id);
    }

    if (titleText === title) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
        { 'todo-temp': id === 0 },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => {
            setLoaderTodo(id);
            patchHandlerTodoCompleted(id, !completed);
          }}
        />
      </label>

      {!clickedForm ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setClickedForm(true);
            }}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              setLoaderTodo(id);
              deleteClickHandler(id);
            }}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={onSubmitFormHandler}
          onBlur={onBlurHandler}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={titleText}
            onChange={changeValueHandler}
            onKeyUp={(e) => {
              if (e.key === 'Escape') {
                setClickedForm(false);
              }
            }}
          />
        </form>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active':
          loaderTodo === id
          || id === 0
          || loadingTodoIds?.includes(id),
        },
      )}
      >
        <div className="
          modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};

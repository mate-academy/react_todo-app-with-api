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
    completed: boolean,
    bringInList: boolean,
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
  const [titleText, setTitleText] = useState(title || '');

  const handleChangeValue = (event: React.FormEvent<HTMLInputElement>) => {
    setTitleText(event.currentTarget.value);
  };

  const handlerSubmitForm = (e:React.SyntheticEvent) => {
    e.preventDefault();
    setLoaderTodo(id);
    setClickedForm(false);

    if (titleText) {
      patchHandlerTodoTitle(id, titleText);
    }
  };

  const handlerBlur = (e:React.SyntheticEvent) => {
    setClickedForm(false);

    if (!titleText) {
      setLoaderTodo(id);
      deleteClickHandler(id);
    }

    if (titleText === title) {
      e.preventDefault();
    }
  };

  const handlerTodoStatus = () => {
    setLoaderTodo(id);
    patchHandlerTodoCompleted(id, !completed, true);
  };

  const handlerEscapeButton = (e:React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setClickedForm(false);
    }
  };

  const handlerTodoTemove = () => {
    setLoaderTodo(id);
    deleteClickHandler(id);
  };

  const handlerFormOn = () => {
    setClickedForm(true);
  };

  const checkActiveId = loaderTodo === id
  || id === 0
  || loadingTodoIds?.includes(id);

  return (
    <div
      className={classNames(
        'todo',
        { completed },
        { 'todo-temp': !id },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={handlerTodoStatus}
        />
      </label>

      {!clickedForm ? (
        <>
          <span
            className="todo__title"
            onDoubleClick={handlerFormOn}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handlerTodoTemove}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handlerSubmitForm}
          onBlur={handlerBlur}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={titleText}
            onChange={handleChangeValue}
            onKeyUp={handlerEscapeButton}
          />
        </form>
      )}

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active': checkActiveId,
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

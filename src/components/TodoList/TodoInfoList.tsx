import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useAppContextContainer } from '../../context/AppContext';
import { useState } from 'react';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todo: Todo;
};

const TodoListInfo = ({ todo }: Props) => {
  const {
    dltTodo,
    switchTodoCompleted,
    inputRef,
    changeTitle,
    switchEdited,
    changeEdited,
    ckickEsc,
  } = useAppContextContainer();
  const { completed, title, id, loaded, isEdited } = todo;
  const [prevTitle, setPrevTitle] = useState<string>('');

  const handleDoubleclickEdited = () => {
    setPrevTitle(title);
    changeEdited(todo);
  };

  const handleClickDeleteTodo = (todoId: number) => {
    dltTodo(todoId);
  };

  const handleClickSwitch = (change: Todo) => {
    switchTodoCompleted(change);
  };

  const handleBlurSwitch = () => {
    if (!title.length) {
      inputRef.current?.focus();

      return dltTodo(id);
    }

    switchEdited(todo);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    changeTitle(id, value);
  };

  const handleSubmitNewTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.length) {
      return dltTodo(id);
    }

    switchEdited(todo);
  };

  const handlekeyUpClickEsc = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === `Escape`) {
      ckickEsc(id, prevTitle);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => handleClickSwitch(todo)}
          defaultChecked={completed}
        />
      </label>

      {isEdited ? (
        <form onSubmit={handleSubmitNewTitle} onKeyUp={handlekeyUpClickEsc}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleChangeTitle}
            onBlur={handleBlurSwitch}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={handleDoubleclickEdited}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleClickDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loaded,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoListInfo;

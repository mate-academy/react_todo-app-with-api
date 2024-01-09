import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (value: number) => void,
  arrayLoader: number[] | null,
  handleUpdateTodo: (value: Todo) => void,
  quryInput: string,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  arrayLoader,
  handleUpdateTodo,
}) => {
  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [changeQuryInput, setChangeQuryInput] = useState('');

  const { id, title, completed } = todo;
  const deleteID = () => {
    handleDeleteTodo(id);
  };

  const inputFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [isVisibleInput]);

  const changeTitle = () => {
    setIsVisibleInput(true);
    setChangeQuryInput(title);
  };

  const findIdIsLoader = () => {
    if (arrayLoader) {
      return arrayLoader.some(item => item === id);
    }

    return false;
  };

  const onSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();

    if (changeQuryInput === title) {
      setIsVisibleInput(false);
      return;
    }

    if (!changeQuryInput.length) {
      handleDeleteTodo(id);
    }

    setIsVisibleInput(false);
    handleUpdateTodo({ ...todo, title: changeQuryInput });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsVisibleInput(false);
    }
  };

  const sendUpdateTodo = () => {
    handleUpdateTodo({ ...todo, completed: !completed });
  };

  const loaderId = findIdIsLoader();

  return (
    <>
      <div
        key={id}
        data-cy="Todo"
        onDoubleClick={changeTitle}
        className={classNames('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={sendUpdateTodo}
          />
        </label>
        {isVisibleInput && (
          <form
            onSubmit={onSubmitInput}
            onBlur={onSubmitInput}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={changeQuryInput}
              ref={inputFocus}
              onChange={(e) => setChangeQuryInput(e.target.value)}
              onKeyUp={handleKeyUp}
            />
          </form>
        )}

        {!isVisibleInput && (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={deleteID}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loaderId,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

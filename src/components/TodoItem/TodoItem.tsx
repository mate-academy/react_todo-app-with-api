import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handlDdeleteTodo: (value: number) => void,
  arryLoader: number[] | null,
  handlUpdateTodo: (value: Todo) => void,
  quryInput: string,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handlDdeleteTodo,
  arryLoader,
  handlUpdateTodo,
}) => {
  const [isVisibleInput, setIsVisibleInput] = useState(false);
  const [changeQuryInput, setChangeQuryInput] = useState('');

  const { id, title, completed } = todo;
  const deleteID = () => {
    handlDdeleteTodo(id);
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
    if (arryLoader) {
      return arryLoader.find(item => item === id);
    }

    return false;
  };

  const onSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();

    if (changeQuryInput === title) {
      setIsVisibleInput(false);
    }

    if (changeQuryInput.length === 0) {
      handlDdeleteTodo(id);
    }

    setIsVisibleInput(false);
    handlUpdateTodo({ ...todo, title: changeQuryInput });
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsVisibleInput(false);
    }
  };

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
            onClick={() => handlUpdateTodo({ ...todo, completed: !completed })}
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
            'is-active': findIdIsLoader()
            || (findIdIsLoader() === 0),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};

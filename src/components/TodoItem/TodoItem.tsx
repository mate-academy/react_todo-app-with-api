import classNames from 'classnames';
import { KeyboardEventHandler, useContext, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { MyContext, MyContextData } from '../context/myContext';
import { deleteTodo, updateTodo } from '../../api/todos';

interface Props {
  todo: Todo | null;
  // loading: number[] | [];
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { handleSetError, focusField, reducer, handleSetLoading, loading } =
    useContext(MyContext) as MyContextData;

  const { remove, toggle, changeInput } = reducer;
  const [mainTitle, setMainTitle] = useState(todo?.title);
  const [isActive, setIsActive] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  if (todo === null) {
    return null;
  }

  const { id, completed, title } = todo as Todo;
  const isLoading = id === 0 || !!loading.find(elem => elem === id);
  const oldTitle = title;

  const handleClick = () => {
    handleSetLoading([...loading, id as number]);
    deleteTodo(id as number)
      .then(() => {
        remove(id as number);
      })
      .catch(() => {
        handleSetError('Unable to delete a todo');
      })
      .finally(() => {
        setTimeout(() => {
          focusField();
        }, 0);
        handleSetLoading(loading.filter(elem => elem !== id));
      });
  };

  const handleToggle = () => {
    handleSetLoading([...loading, id as number]);

    updateTodo(id as number, { completed: !completed })
      .then(() => {
        handleSetLoading(loading.filter(elem => elem !== id));
        toggle(id as number);
      })
      .catch(() => {
        handleSetError('Unable to update a todo');
      })
      .finally(() => {
        handleSetLoading(loading.filter(elem => elem !== id));
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainTitle(e.target.value);
  };

  const handleDoubleClick = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    const obj = {
      id,
      title: mainTitle,
      completed,
    };

    if (mainTitle.trim() === '') {
      handleClick();
    }

    handleSetLoading([...loading, id as number]);
    setIsActive(false);
    updateTodo(id as number, { title: mainTitle })
      .then(() => {
        handleSetLoading(loading.filter(elem => elem !== id));
      })
      .catch(() => {
        handleSetError('Enable to update a todo');
      })
      .finally(() => handleSetLoading(loading.filter(elem => elem !== id)));
    setIsActive(false);

    changeInput(obj as Todo);
  };

  const keyHandler: KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Enter') {
      handleBlur();
    } else if (event.key === 'Escape') {
      setMainTitle(oldTitle);
      setIsActive(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
        'temp-item-enter-done': id === 0,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => handleToggle()}
        />
      </label>
      {!isActive ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleClick}
          >
            ×
          </button>
        </>
      ) : (
        <input
          type="text"
          className="edit"
          value={mainTitle}
          onChange={handleChange}
          onKeyUp={keyHandler}
          onBlur={handleBlur}
          ref={input}
        />
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

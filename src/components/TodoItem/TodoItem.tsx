import React, {
  useContext, useState, useRef, useEffect,
} from 'react';
import classNames from 'classnames';
import { TodoAppContext } from '../../TodoAppContext';

type Props = {
  id: number,
  completed: boolean,
  title: string,
};

export const TodoItem: React.FC<Props> = ({
  id, completed, title,
}) => {
  const {
    processings,
    removeTodo,
    loading,
    updateTodoData,
  } = useContext(TodoAppContext);

  const [isVisibleForm, setIsVisibleForm] = useState(false);
  const todoField = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(title);

  useEffect(() => {
    if (todoField.current && isVisibleForm) {
      todoField.current.focus();
      setValue(title);
    }

    setValue(title);
  }, [isVisibleForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = value.trim();

    if ((title === inputValue && e.code === 'Enter') || e.code === 'Escape') {
      setIsVisibleForm(false);

      return;
    }

    if (e.code === 'Enter' && inputValue) {
      const data = { title: value };

      updateTodoData(id, data);
      setIsVisibleForm(false);
    }

    if (e.code === 'Enter' && !inputValue) {
      removeTodo(id);
      setIsVisibleForm(false);
    }
  };

  const handleBlur = () => {
    const inputValue = value.trim();

    if (title === inputValue) {
      setIsVisibleForm(false);

      return;
    }

    if (inputValue) {
      const data = { title: value };

      updateTodoData(id, data);
      setIsVisibleForm(false);
    }

    if (!inputValue) {
      removeTodo(id);
      setIsVisibleForm(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
      key={id}
      onDoubleClick={(e) => {
        e.preventDefault();
        setIsVisibleForm(true);
      }}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => updateTodoData(id, { completed: !completed })}
        />
      </label>

      {!isVisibleForm ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={value}
            ref={todoField}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            onBlur={handleBlur}
          />
        </form>
      )}

      {(loading || processings.includes(id) || (id === 0))
      && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

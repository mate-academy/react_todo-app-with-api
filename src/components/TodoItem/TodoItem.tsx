import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo, Property, KeyType } from '../../types';

type Props = {
  todo: Todo,
  removeTodo: (id: number) => void,
  removedTodoId: number | null,
  updateTodo: (id: number, data: Property) => void,
  isLoadingAll: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  removedTodoId,
  updateTodo,
  isLoadingAll,
}) => {
  const { id, title, completed } = todo;
  const [placeHolder, setPlaceHolder] = useState(title);
  const [value, setValue] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEscape, setIsEscape] = useState(false);
  // const isEmpty = value === '';
  const isChanged = placeHolder !== value;

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const looseFocus = (
    event: React.KeyboardEvent<HTMLInputElement>
    | React.FocusEvent<HTMLInputElement>,
  ) => {
    setIsReadOnly(true);
    setValue('');
    event.currentTarget.blur();
  };

  const setFocus = (event: React.MouseEvent<HTMLInputElement>) => {
    setIsReadOnly(false);
    setValue(placeHolder);
    event.currentTarget.focus();
  };

  const changeTitle = (
    event: React.FocusEvent<HTMLInputElement>
    | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    updateTodo(id, { title: event.target.value });
    setPlaceHolder(event.target.value);
    looseFocus(event);
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLInputElement>) => {
    setFocus(event);
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!value) {
      removeTodo(id);

      return;
    }

    if (!isChanged) {
      looseFocus(event);

      return;
    }

    if (isEscape) {
      changeTitle(event);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === KeyType.Enter && !value) {
      removeTodo(id);
    }

    if (event.key === KeyType.Enter && !isChanged && value) {
      looseFocus(event);
    }

    if (event.key === KeyType.Enter && isChanged && value) {
      changeTitle(event);
    }

    if (event.key === KeyType.Escape) {
      setIsEscape(true);
      looseFocus(event);
      setIsEscape(false);
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            updateTodo(id, { completed: !completed });
          }}
        />
      </label>
      <input
        type="text"
        placeholder={placeHolder}
        value={value}
        onChange={onChange}
        onDoubleClick={onDoubleClick}
        className={classNames(
          'todo__title',
          { 'todo__title-transparent': !isReadOnly },
        )}
        readOnly={isReadOnly}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
      />
      <button
        type="button"
        className="todo__remove"
        onClick={() => removeTodo(id)}
        hidden={!isReadOnly}
      >
        ×
      </button>

      {(removedTodoId === id || isLoadingAll) && (
        <div className="overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};

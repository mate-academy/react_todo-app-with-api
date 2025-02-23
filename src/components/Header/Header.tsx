import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { DispatchContext, StateContext } from '../../Store';
import { addPost, onToggleAll } from '../../utils/requests';

type Props = {
  unCompletedTodos: number;
};

export const Header: React.FC<Props> = ({ unCompletedTodos }) => {
  const { todos, tempTodo, shouldFocus } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [value, setValue] = useState('');

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleField.current?.focus();
  }, [shouldFocus]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch({
      type: 'setTempTodo',
      todo: {
        id: 0,
        userId: USER_ID,
        title: value,
        completed: false,
      },
    });

    addPost(dispatch, value.trim())
      .then(() => setValue(''))
      .finally(() => {
        dispatch({ type: 'setTempTodo', todo: null });
      });
  };

  const onKeyEnter = (event: React.KeyboardEvent) => {
    event.preventDefault();

    if (value.trim().length === 0) {
      dispatch({ type: 'setError', message: 'Title should not be empty' });

      return;
    }

    handleSubmit(event);
  };

  const onKeyEscape = (event: React.KeyboardEvent) => {
    setValue('');
    (event.target as HTMLInputElement).blur();
  };

  const onKeyDownHandle = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        onKeyEnter(event);
        break;
      case 'Escape':
        onKeyEscape(event);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: unCompletedTodos === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onToggleAll(dispatch, todos)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={value}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={!!tempTodo}
          placeholder="What needs to be done?"
          onChange={handleOnChange}
          onKeyDown={onKeyDownHandle}
        />
      </form>
    </header>
  );
};

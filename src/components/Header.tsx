import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { addTodos } from '../api/todos';
import { USER_ID } from '../utils/constants';
import { TodoContext } from './TodosContext';

/* eslint-disable jsx-a11y/control-has-associated-label */
export const Header:React.FC = () => {
  const {
    todos,
    activeTodos,
    addTodo,
    toggleAllCompleted,
    setErrorMessage,
    setTempTodo,
    inputRef,
  } = useContext(TodoContext);

  const [titleNewTodo, setTitleNewTodo] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [todos.length, disabledInput, inputRef]);

  const handleAllToggle = () => {
    toggleAllCompleted(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = titleNewTodo.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setDisabledInput(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    addTodos({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    }).then(response => {
      setTitleNewTodo('');
      addTodo(response);
      setTempTodo(null);
    }).catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setDisabledInput(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">

      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: activeTodos.length === 0,
          })}
          data-cy="ToggleAllButton"
          onClick={handleAllToggle}
        />
      )}

      <form onSubmit={event => handleSubmit(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleNewTodo}
          onChange={event => setTitleNewTodo(event.target.value)}
          disabled={disabledInput}
          ref={titleField}
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { TodosContext } from '../TodoContext/TodoContext';
import * as todosServices from '../api/todos';
import { USER_ID } from '../variables/UserID';

export const Header: React.FC = () => {
  const {
    addTodo,
    onToggleAll,
    todos,
    setErrorMessage,
    setTempTodo,
    errorMessage,
  } = useContext(TodosContext);

  const [todoTitle, setTodoTitle] = useState('');
  const [disableInput, setDisableInput] = useState(false);

  const isAllTodosCompleted = todos.every(({ completed }) => completed);

  const handleToggleAll = () => {
    onToggleAll(todos);
  };

  const todoTitleFocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoTitleFocus.current) {
      todoTitleFocus.current.focus();
    }
  }, [todos, errorMessage]);

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title should not be empty');
      setTodoTitle('');
    }

    // eslint-disable-next-line no-extra-boolean-cast
    if (!!todoTitle.trim()) {
      setDisableInput(true);
      setTempTodo({
        id: 0,
        title: todoTitle.trim(),
        userId: USER_ID,
        completed: false,
      });

      todosServices.createTodos({
        title: todoTitle.trim(),
        userId: USER_ID,
        completed: false,
      }).then(response => {
        setTodoTitle('');
        addTodo(response);
        setTempTodo(null);
      })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
          setTempTodo(null);
        })
        .finally(() => {
          setDisableInput(false);
        });
    }
  };

  return (
    <header className="todoapp__header">

      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form
        onSubmit={(event) => handleOnSubmit(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoTitleFocus}
          value={todoTitle}
          disabled={disableInput}
          onChange={(event) => setTodoTitle(event.currentTarget.value)}
        />
      </form>
    </header>
  );
};

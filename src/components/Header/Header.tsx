/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../../utils/TodoContext';
import { postTodo } from '../../api/todos';

export const Header: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const {
    setErrorMessage,
    setTempTodo,
    addTodo,
    setLoadingItems,
    USER_ID,
    handlePatch,
    todos,
    setIsVisibleErrorMessage,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value.trim() === '') {
      setErrorMessage('Title should not be empty');
    }

    const data = {
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo({
      ...data,
      id: 0,
    });

    setLoadingItems((prevState) => [...prevState, 0]);
    postTodo(data)
      .then((response) => {
        addTodo(response);
        setValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setIsVisibleErrorMessage(true);
      })
      .finally(() => {
        setLoadingItems((prevState) => {
          return prevState.filter((id) => id !== 0);
        });
        setTempTodo(null);
        setIsDisabled(false);
        setTimeout(() => {
          if (inputRef.current === null) {
            return;
          }

          inputRef.current.focus();
        }, 0);
      });
  };

  const handleChangeStatusOfAllTodos = () => {
    let todosToChange = todos.filter((todo) => !todo.completed);

    if (todos.every((todo) => todo.completed)
    || todos.every((todo) => !todo.completed)) {
      todosToChange = todos;
    }

    todosToChange.forEach((todo) => {
      const data = {
        ...todo,
        completed: !todo.completed,
      };

      handlePatch(todo, data);
    });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every((todo) => todo.completed),
        })}
        data-cy="ToggleAllButton"
        onClick={handleChangeStatusOfAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          disabled={isDisabled}
          ref={inputRef}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </form>
    </header>
  );
};

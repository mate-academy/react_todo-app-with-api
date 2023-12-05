/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';

import { addTodo } from '../api/todos';
import { TodoContext } from './TodoContex';

const TodoHeader: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const {
    todos,
    setTodos,
    setErrorMessage,
    userId,
  } = useContext(TodoContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handlePressEnter = (event: React.FormEvent<HTMLFormElement>
  | React.KeyboardEvent<HTMLInputElement>) => {
    if ((event as React.KeyboardEvent<HTMLInputElement>).key === 'Enter') {
      event.preventDefault();

      if (inputValue.trim() === '') {
        setErrorMessage('Title should not be empty');
      } else {
        addTodo({
          title: inputValue,
          completed: false,
          userId,
        }).then(newTodo => {
          setTodos([...todos, newTodo]);
        }).catch(() => setErrorMessage('Unable to add a todo'));

        setInputValue('');
      }
    }
  };

  const handleChangeToggle = () => {
    const completedValue = !todos.every(todo => todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: completedValue,
    }));

    setTodos(updatedTodos);
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const isEveryTodoActive = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      <form onSubmit={(event) => event.preventDefault()}>
        <button
          type="button"
          className={
            cn('todoapp__toggle-all',
              { active: isEveryTodoActive })
          }
          data-cy="ToggleAllButton"
          onClick={handleChangeToggle}
        />

        <input
          type="text"
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          value={inputValue}
          placeholder="What needs to be done?"
          onChange={handleChange}
          onKeyDown={handlePressEnter}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default TodoHeader;

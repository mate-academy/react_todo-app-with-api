/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { TodosContext } from './TodosContext';
import * as todoService from '../api/todos';

export const Header = () => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    todos,
    setTodos,
    setErrorMessage,
    userId: USER_ID,
  } = useContext(TodosContext);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        todoService.addTodo({
          title: inputValue,
          completed: false,
          userId: USER_ID,
        }).then(newTodo => {
          setTodos([...todos, newTodo]);
        }).catch(() => setErrorMessage('Unable to add a todo'));

        setInputValue('');
      }
    }
  };

  const handleChangeToggle = () => {
    const completedValue = todos.some(todo => !todo.completed);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: completedValue,
    }));

    setTodos(updatedTodos);
  };

  return (
    <header className="todoapp__header">
      <form onSubmit={handlePressEnter}>
        {todos.length > 0 && (
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: todos.every(todo => todo.completed) },
            )}
            data-cy="ToggleAllButton"
            onClick={handleChangeToggle}
          />
        )}

        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handlePressEnter}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

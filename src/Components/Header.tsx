import React, { useEffect, useState } from 'react';
import { USER_ID, changeTodo, postTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { getTodosToToggle } from '../utils/functions';
import { useTodoContext } from './GlobalProvider';

export const Header: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const {
    todos,
    setTodos,
    setTempTodo,
    setErrorMessage,
    inputRef,
    setIsToggling,
  } = useTodoContext();

  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding, inputRef]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedInput = input.trim();

    if (normalizedInput.length === 0) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    });

    postTodo({
      userId: USER_ID,
      title: normalizedInput,
      completed: false,
    })
      .then(data => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, data]);
        setInput('');
      })
      .catch(() => {
        setTempTodo(null);
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  const onToggle = (id: number) => {
    setIsToggling(true);
    changeTodo(id, { completed: todos.length !== completedTodos.length })
      .then(() => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(prevTodo => ({
            ...prevTodo,
            completed: todos.length !== completedTodos.length,
          })),
        );
      })
      .finally(() => {
        setIsToggling(false);
      });
  };

  const handleToggle = () => {
    getTodosToToggle(todos).forEach(todo => onToggle(todo.id));
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          })}
          onClick={handleToggle}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

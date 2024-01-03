import {
  FC, useEffect, useRef, useState, ChangeEvent, FormEvent,
} from 'react';
import cn from 'classnames';
import { useAppContext } from '../context/AppContext';
import { USER_ID } from '../USER_ID';
import { postTodo, updateTodo } from '../api/todos';
import { Todo } from '../types';

export const Header: FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const {
    setErrorMessage,
    setShowError,
    setTempTodo,
    tempTodo,
    setTodos,
    todos,
    completedTodosNum,
    setTodosBeingLoaded,
  } = useAppContext();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setErrorMessage('Title should not be empty');
      setShowError(true);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo({
      ...newTodo,
      id: 0,
    });

    postTodo(newTodo)
      .then(response => {
        setTodos(prev => ([...prev, response]));
        setInputValue('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setShowError(true);
      })
      .finally(() => setTempTodo(null));
  };

  const handleToggleAllStatus = () => {
    setTodosBeingLoaded(todos.map(todo => todo.id));

    if (todos.length === completedTodosNum) {
      Promise.all(todos
        .map(todo => updateTodo(todo.id, { ...todo, completed: false })))
        .then(response => (
          setTodos(response as Todo[])
        ))
        .catch(() => {
          setErrorMessage('Unable to update todos');
          setShowError(true);
        })
        .finally(() => setTodosBeingLoaded([]));
    } else {
      Promise.all(todos
        .map(todo => updateTodo(todo.id, { ...todo, completed: true })))
        .then(response => (
          setTodos(response as Todo[])
        ))
        .catch(() => {
          setErrorMessage('Unable to update todos');
          setShowError(true);
        })
        .finally(() => setTodosBeingLoaded([]));
    }
  };

  const todoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoInputRef.current && tempTodo === null) {
      todoInputRef.current.focus();
    }
  }, [todos, tempTodo]);

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: completedTodosNum === todos.length,
        })}
        data-cy="ToggleAllButton"
        onClick={handleToggleAllStatus}
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={handleInputSubmit}
      >
        <input
          value={inputValue}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={todoInputRef}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};

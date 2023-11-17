/* eslint-disable jsx-a11y/control-has-associated-label */

import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { PartialTodo, TodosContext } from '../TodoContext';
import { addTodo } from '../api/todos';

export const USER_ID = 11880;

export const Header: React.FC = () => {
  const {
    allTodos,
    setAllCompleted,
    setError,
    setTitleDisabled,
    setTempTodo,
    setAllTodos,
    newTimeout,
    tempTodo,
    titleDisabled,
  } = useContext(TodosContext);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(e.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, allTodos]);

  const todoData: PartialTodo = {
    userId: USER_ID,
    completed: false,
    title: newTodoTitle,
  };

  const onSubmit = (e: React.FormEvent) => {
    setError('');
    setTitleDisabled(true);
    e.preventDefault();
    todoData.title = newTodoTitle;

    if (todoData.title.trim() === '') {
      setError('Title should not be empty');

      todoData.title = '';
      setTimeout(() => {
        setError('');
      }, 3000);

      setTitleDisabled(false);

      return;
    }

    setTempTodo({
      completed: false,
      title: newTodoTitle.trim(),
      id: 0,
      userId: USER_ID,
    });

    addTodo({
      userId: USER_ID,
      completed: false,
      title: newTodoTitle.trim(),
    })
      .then((data) => {
        setNewTodoTitle('');
        setAllTodos([...allTodos, data]);
      })
      .catch(() => {
        setError('Unable to add a todo');

        setTimeout(() => {
          setError('');
        }, newTimeout);

        setTempTodo(null);
      })
      .finally(() => {
        setTempTodo(null);
        setTitleDisabled(false);
      });
  };

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allTodos.every(todo => todo.completed) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() => setAllCompleted()}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={titleDisabled}
        />
      </form>
    </header>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../Store/TodoContext';
import { Todo } from '../../types/Todo';
import { addTodos, updateTodos } from '../../api/todos';

export const Header: React.FC = () => {
  const {
    setErrorMessage,
    errorMessage,
    setTodos,
    todos,
    setTempTodo,
    tempTodo,
  } = useContext(TodoContext);
  const [title, setTitle] = useState('');
  const focus = useRef<HTMLInputElement>(null);

  const addTodo = (data: Todo) => {
    addTodos(data)
      .then(newTodo => {
        setTitle('');
        setTodos(currentTodo => [...currentTodo, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const creatNewTodo = () => {
    const newTodo: Todo = {
      id: 0,
      userId: 260,
      title,
      completed: false,
    };

    setTempTodo(newTodo);
    addTodo(newTodo);
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.length < 1 || title.trim() === '') {
      setErrorMessage('Title should not be empty');
    } else {
      creatNewTodo();
    }
  };

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  useEffect(() => {
    focus.current?.focus();
  }, [title, errorMessage]);

  const updatedComplet = (post: Todo) => {
    const updatedTodo: Todo = {
      id: post.id,
      userId: 260,
      title: post.title.trim(),
      completed: !post.completed,
    };

    updateTodos(post.id, updatedTodo);
  };

  const handlerCompleteAll = () => {
    if (todos.some(todo => todo.completed === false)) {
      const activeTodos = todos.filter(todo => !todo.completed);

      const updateTodo = todos.map(todo => ({
        ...todo,
        completed: true,
      }));

      activeTodos.map(todo => updatedComplet(todo));

      setTodos(updateTodo);
    } else {
      const updateTodo = todos.map(todo => ({
        ...todo,
        completed: false,
      }));

      todos.map(todo => updatedComplet(todo));

      setTodos(updateTodo);
    }
  };

  const handleWaitResponse = () => {
    if (tempTodo !== null) {
      return true;
    }

    return false;
  };

  const isAllCompleted = todos.every(todo => todo.completed);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length !== 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handlerCompleteAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          id="todoInput"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitle}
          ref={focus}
          disabled={handleWaitResponse()}
        />
      </form>
    </header>
  );
};

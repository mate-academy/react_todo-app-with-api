import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import * as postService from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages } from '../utils/ErrorMessages';

type Props = {
  setTodoList: (arg: Todo[] | ((arg: Todo[]) => Todo[])) => void,
  setErrorMessage: (error: ErrorMessages) => void,
  setTempTodo: (arg: Todo | null) => void,
  updateTodo: (arg: Todo) => Promise<Todo | void>,
  todoList: Todo[],
  setLoadingId: (arg: number[] | ((arg: number[]) => number[])) => void,
  loadingId: number[],
  activeTodosCount: number
};

export const USER_ID = 11457;

export const Header: React.FC<Props> = ({
  setTodoList,
  setErrorMessage,
  setTempTodo,
  updateTodo,
  todoList,
  setLoadingId,
  loadingId,
  activeTodosCount,

}) => {
  const [title, setTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const toggleTodo = (todoToUpdate: Todo) => {
    setLoadingId((prevIdis: number[]) => [...prevIdis, todoToUpdate.id]);

    updateTodo({
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    })
      .then((updatedTodo: Todo | void) => {
        setTodoList((currentTodos: Todo[]) => currentTodos
          .map(todo => (todo.id === updatedTodo?.id ? updatedTodo : todo)));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.UpdateError);
        throw new Error();
      })
      .finally(() => {
        setLoadingId((prevIdis: number[]) => prevIdis
          .filter(id => id !== todoToUpdate.id));
      });
  };

  const allCompleted = todoList.every(({ completed }) => completed);

  const handleToggleAll = () => {
    if (allCompleted) {
      todoList.forEach(toggleTodo);

      return;
    }

    const activeTodos = todoList.filter(todo => !todo.completed);

    activeTodos.forEach(toggleTodo);
  };

  const addNewTodo = (todo: Todo) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    setErrorMessage(ErrorMessages.NoError);
    setLoadingId([0]);

    postService.createTodo(todo)
      .then(newTodo => {
        setTodoList((currentTodos: Todo[]) => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.AddError);
        throw new Error();
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingId([]);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.EmptyTitleError);
      throw new Error();

      return;
    }

    addNewTodo({
      id: +new Date(),
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="button"
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: !activeTodosCount,
        })}
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={!!loadingId.length}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};

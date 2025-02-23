import React, { useContext, useState, useRef, useEffect, useMemo } from 'react';
import cn from 'classnames';

import { USER_ID, postTodo, updateTodo } from '../api/todos';
import { StateContext, DispatchContext } from '../store/TodoContext';
import { useErrorMessage } from './useErrorMessage';
import { Todo } from '../types/Todo';

import {
  setInputFocuseAction,
  setTodosAction,
  setTempTodoAction,
  setLoadingItemIdsAction,
} from './todoActions';

export const Header: React.FC = () => {
  const { todos, isInputFocused, loadingItemIds } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const handleError = useErrorMessage();

  const [todoTitle, setTodoTitle] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const focusField = useRef<HTMLInputElement>(null);

  const areAllTodosCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );
  const uncompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  useEffect(() => {
    if (isInputFocused) {
      focusField.current?.focus();
      dispatch(setInputFocuseAction(false));
    }
  }, [isInputFocused, dispatch]);

  const addTodo = async (newTodo: Omit<Todo, 'id'>) => {
    setIsFormSubmitted(true);

    try {
      const todoFromServer = await postTodo(newTodo);

      dispatch(setTodosAction([...todos, todoFromServer]));
      setTodoTitle('');
    } catch {
      handleError('Unable to add a todo');
    } finally {
      dispatch(setTempTodoAction(null));
      dispatch(setInputFocuseAction(true));
      dispatch(setLoadingItemIdsAction([]));
      setIsFormSubmitted(false);
    }
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim().length) {
      handleError('Title should not be empty');
      setIsFormSubmitted(false);

      return;
    }

    const newTodo = {
      title: todoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    const newTempTodo = {
      ...newTodo,
      id: 0,
    };

    setIsFormSubmitted(true);

    addTodo(newTodo);

    dispatch(setLoadingItemIdsAction([0]));
    dispatch(setTempTodoAction(newTempTodo));
  };

  const handleEscKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setTodoTitle('');
      dispatch(setInputFocuseAction(true));
    }
  };

  const handleToggleTodoStatus = async (todo: Todo) => {
    try {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      return await updateTodo(updatedTodo);
    } catch (error) {
      handleError('Unable to update a todo');
    } finally {
      dispatch(
        setLoadingItemIdsAction(loadingItemIds.filter(id => id !== todo.id)),
      );
    }

    return null;
  };

  const handleToggleAll = async () => {
    if (areAllTodosCompleted) {
      dispatch(
        setLoadingItemIdsAction([...completedTodos.map(todo => todo.id)]),
      );

      try {
        const result = await Promise.all(
          completedTodos.map(todo => handleToggleTodoStatus(todo)),
        );

        const newTodos = todos.map(
          currentTodo =>
            result.find(t => t?.id === currentTodo.id) || currentTodo,
        );

        dispatch(setTodosAction(newTodos));
      } catch {
        handleError('Unable to update a todo');
      } finally {
        dispatch(setLoadingItemIdsAction([]));
      }
    } else {
      dispatch(
        setLoadingItemIdsAction([...uncompletedTodos.map(todo => todo.id)]),
      );

      try {
        const result = await Promise.all(
          uncompletedTodos.map(todo => handleToggleTodoStatus(todo)),
        );

        const newTodos = todos.map(
          currentTodo =>
            result.find(t => t?.id === currentTodo.id) || currentTodo,
        );

        dispatch(setTodosAction(newTodos));
      } catch {
        handleError('Unable to update a todo');
      } finally {
        dispatch(setLoadingItemIdsAction([]));
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
          disabled={todos.length === 0}
        />
      )}

      <form onSubmit={onFormSubmit}>
        <input
          ref={focusField}
          value={todoTitle}
          onChange={event => setTodoTitle(event.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onKeyUp={handleEscKeyUp}
          disabled={isFormSubmitted}
        />
      </form>
    </header>
  );
};

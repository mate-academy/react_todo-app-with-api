import React, { useRef, useEffect, useState } from 'react';
import { USER_ID } from '../api/todos';
import { useTodos } from './TodoContext';
import { ErrorText } from '../types/ErrorText';
import { Todo } from '../types/Todo';
import * as todosServices from '../api/todos';
import classNames from 'classnames';

export const Header: React.FC = () => {
  const [inputTodo, setInputTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const { todos, addTodo, setErrMessage, setTodos } = useTodos(); // Добавление setTodos
  const allCompleted = todos.every(el => el.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleAddTodo = async () => {
    const trimmedInput = inputTodo.trim();

    if (trimmedInput) {
      try {
        setLoading(true);
        await addTodo({
          id: Date.now(),
          title: trimmedInput,
          completed: false,
          userId: USER_ID,
        });
        setInputTodo('');
        setLoading(false);
      } catch (error) {
        setErrMessage(ErrorText.AddErr);
        setLoading(false);
      }
    } else {
      setErrMessage(ErrorText.EmptyTitleErr);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMessage(ErrorText.NoErr);
    handleAddTodo();
  };

  const handleToggleAll = async () => {
    try {
      setLoading(true);

      const unfinishedTasks = todos.filter(todo => !todo.completed);
      const shouldComplete = unfinishedTasks.length > 0;

      const updatedTodos = await Promise.all<Todo>(
        todos.map(async todo => {
          const updatedTodo = await todosServices.updateTodo(todo.id, {
            ...todo,
            completed: shouldComplete,
          });

          return updatedTodo as Todo;
        }),
      );

      setTodos(updatedTodos);
    } catch (error) {
      setErrMessage(ErrorText.ToggleAllErr);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          onClick={handleToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={inputTodo}
          onChange={e => setInputTodo(e.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};

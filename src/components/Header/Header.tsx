import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useAppContext } from '../../HooksContext';
import { client } from '../../utils/fetchClient';

export const Header: React.FC = () => {
  const {
    setErrorMessage,
    loading,
    allTodos,
    setLoading,
    setAllTodos,
    inputText,
    setInputText,
    setTempTodo,
  } = useAppContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [setErrorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  const completeAll = () => {
    return async () => {
      setLoading(true);

      let idTodosToComplete = allTodos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      const updatedIds: number[] = [];

      if (idTodosToComplete.length === 0) {
        idTodosToComplete = allTodos.map(theTodo => theTodo.id);
      }

      try {
        await Promise.all(
          idTodosToComplete.map(async id => {
            const body = {
              completed: allTodos.find(curTodo => curTodo.id === id)?.completed,
            };

            try {
              await client.patch(`/todos/${id}`, body);
              updatedIds.push(id);
            } catch (error) {
              setErrorMessage('Unable to update a todo');
            }
          }),
        );

        const updatedTodos = allTodos.map(todo =>
          updatedIds.includes(todo.id)
            ? { ...todo, completed: !todo.completed }
            : todo,
        );

        setAllTodos(updatedTodos);
      } catch (error) {
        setErrorMessage('Unable to update one ore more todos');
      } finally {
        setLoading(false);
      }
    };
  };

  const addTodo = () => {
    return (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      if (inputText.trim() === '') {
        setErrorMessage('Title should not be empty');
        setLoading(false);

        return;
      }

      const newId =
        allTodos.length === 0
          ? 1
          : Math.max(...allTodos.map(todo => todo.id)) + 1;

      const newTodo = {
        id: newId,
        userId: 2248,
        completed: false,
        title: inputText.trim(),
      };

      const tempTodo = {
        ...newTodo,
        id: 0,
      };

      setTempTodo(tempTodo);

      client
        .post('/todos', newTodo)
        .then(() => {
          setAllTodos(prevTodos => [...prevTodos, newTodo]);
          setInputText('');
          setTempTodo(null);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };

  return (
    <header className="todoapp__header">
      {allTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allTodos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={completeAll()}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={addTodo()}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          disabled={loading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

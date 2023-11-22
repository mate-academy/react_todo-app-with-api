/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useTodos } from '../hooks/useTodos';
import * as postService from '../api/todos';
import { USER_ID } from '../utils/USER_ID';

export const Header: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    todos,
    setTodos,
    setErrorMessage,
    setTempTodo,
    todosInProcess,
    setTodosInProcess,
  } = useTodos();

  const todosInProcessCopy = todosInProcess;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, !todos?.length, todosInProcessCopy]);

  const activeTodos = todos?.filter(todo => (
    !todo.completed
  ));

  const handletTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');

    setTitle(event.target.value.trimStart());
  };

  const toggleAllTodos = () => {
    if (!activeTodos?.length) {
      todos?.forEach((todo) => {
        setTodosInProcess(prevTodosIds => ([...prevTodosIds, todo.id]));

        postService.updateTodoCompleted(todo.id, { completed: false })
          .then((updatedTodo) => {
            setTodos(prevTodos => {
              if (prevTodos) {
                return prevTodos.map(currentTodo => {
                  if (currentTodo.id === todo.id) {
                    return updatedTodo;
                  }

                  return currentTodo;
                });
              }

              return null;
            });
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => setTodosInProcess(prevTodosIds => (
            prevTodosIds.filter(id => todo.id !== id)
          )));
      });
    }

    if (activeTodos) {
      activeTodos.forEach((todo) => {
        setTodosInProcess(prevTodosIds => ([...prevTodosIds, todo.id]));

        postService.updateTodoCompleted(todo.id, { completed: true })
          .then((updatedTodo) => {
            setTodos(prevTodos => {
              if (prevTodos) {
                return prevTodos.map(currentTodo => {
                  if (currentTodo.id === todo.id) {
                    return updatedTodo;
                  }

                  return currentTodo;
                });
              }

              return null;
            });
          })
          .catch(() => setErrorMessage('Unable to update a todo'))
          .finally(() => setTodosInProcess(prevTodosIds => (
            prevTodosIds.filter(id => todo.id !== id)
          )));
      });
    }
  };

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsInputDisabled(true);
    setErrorMessage('');

    const trimedTitile = title.trim();

    setTempTodo({
      id: 0,
      userId: 0,
      title: trimedTitile,
      completed: false,
    });

    postService.addTodo(
      { title: trimedTitile, completed: false, userId: USER_ID },
    ).then((newTodo) => {
      setTitle('');

      setTodos(prevTodos => {
        if (prevTodos) {
          return [...prevTodos, newTodo];
        }

        return null;
      });
    }).catch(() => {
      setErrorMessage('Unable to add a todo');
    }).finally(() => {
      setIsInputDisabled(false);
      setTempTodo(null);
    });
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos?.length && (
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all',
            {
              active: !activeTodos?.length,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form
        onSubmit={addTodo}
      >
        <input
          disabled={isInputDisabled}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handletTitleChange}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

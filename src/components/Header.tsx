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
  const todosLength = !todos?.length;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputDisabled, todosLength, todosInProcessCopy]);

  const activeTodos = todos?.filter(todo => (
    !todo.completed
  ));

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');

    setTitle(event.target.value.trimStart());
  };

  const toggleAllTodos = () => {
    if (!activeTodos?.length) {
      todos?.forEach((todo) => {
        setTodosInProcess(prevTodosIds => ([...prevTodosIds, todo.id]));

        postService.updateTodoCompleted(todo.id, { completed: false })
          .then((updateStatus) => {
            setTodos(prevTodos => {
              if (prevTodos) {
                return prevTodos.map(currentTodo => {
                  if (currentTodo.id === todo.id) {
                    return updateStatus;
                  }

                  return currentTodo;
                });
              }

              return null;
            });
          })
          .catch(() => setErrorMessage('Unable to update todo'))
          .finally(() => setTodosInProcess(
            prevTodosIds => (prevTodosIds.filter(id => todo.id !== id)
            ),
          ));
      });
    }

    if (activeTodos) {
      activeTodos.forEach((todo) => {
        setTodosInProcess(prevTodosIds => ([...prevTodosIds, todo.id]));

        postService.updateTodoCompleted(todo.id, { completed: true })
          .then((updateStatus) => {
            setTodos(prevTodos => {
              if (prevTodos) {
                return prevTodos.map(currentTodo => {
                  if (currentTodo.id === todo.id) {
                    return updateStatus;
                  }

                  return currentTodo;
                });
              }

              return null;
            });
          })
          .catch(() => setErrorMessage('Unable to update todo'))
          .finally(() => setTodosInProcess(
            prevTodosIds => (prevTodosIds.filter(id => todo.id !== id)
            ),
          ));
      });
    }
  };

  const addTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsInputDisabled(true);
    setErrorMessage('');

    const trimedTitle = title.trim();

    setTempTodo({
      id: 0,
      userId: 0,
      title: trimedTitle,
      completed: false,
    });

    postService.addTodos(
      { title: trimedTitle, completed: false, userId: USER_ID },
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
      {!!todos?.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isInputDisabled}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};

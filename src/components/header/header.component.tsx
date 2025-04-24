import React, { useCallback, useEffect, useState } from 'react';
import { HeaderTypes } from './header.types';
import { addTodo, updateTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { text } from '../../constants/text';
import classNames from 'classnames';

export const HeaderComponent: React.FC<HeaderTypes> = ({
  setCustomError,
  setTodos,
  todos,
  customError,
  handleLoaderId,
  titleField,
}) => {
  const [disabled, setIsDisabled] = useState<boolean>(false);
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0,
    userId: USER_ID,
    title: '',
    completed: false,
  });

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [titleField]);

  const titleHandleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewTodo(prevState => ({
        ...prevState,
        title: event.target.value,
      }));
    },
    [],
  );

  const reset = () => {
    setNewTodo(prevState => ({ ...prevState, title: '' }));
  };

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setCustomError('');
      setIsDisabled(true);
      const trimmedTitle = newTodo.title.trim();

      handleLoaderId(newTodo);

      if (!trimmedTitle.length) {
        setCustomError(text.titleShouldNotBeEmpty);
        setIsDisabled(false);
        if (titleField.current) {
          titleField.current.focus();
        }

        return;
      }

      const todoToSave = { ...newTodo, title: trimmedTitle };

      setTodos(prevState => {
        return [...prevState, todoToSave];
      });

      addTodo(todoToSave)
        .then(todoFromServer => {
          setTodos(prevState =>
            prevState.map(todo => {
              if (todo.id === 0) {
                return todoFromServer;
              }

              return todo;
            }),
          );
          reset();
          setIsDisabled(false);
          setTimeout(() => {
            if (titleField.current) {
              titleField.current.focus();
            }
          }, 0);
          handleLoaderId(newTodo);
        })
        .catch(err => {
          setCustomError(text.unableToAddTodo);
          setTodos(prevState =>
            prevState.filter(todo => todo.id !== todoToSave.id),
          );
          setIsDisabled(false);

          setTimeout(() => {
            if (titleField.current) {
              titleField.current.focus();
            }
          }, 0);
          handleLoaderId(newTodo);

          throw new Error(err);
        });
    },
    [handleLoaderId, newTodo, setCustomError, setTodos, titleField],
  );

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (customError) {
      timerId = setTimeout(() => setCustomError(''), 3000);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [customError, setCustomError]);

  const handleCompletedAll = useCallback(() => {
    setCustomError('');
    const isCompletedAll = todos.every(todo => todo.completed);
    let promises;

    todos.forEach(item => handleLoaderId(item));
    if (isCompletedAll) {
      promises = todos.map(todo =>
        updateTodo(todo.id, { ...todo, completed: false }),
      );
    } else {
      const completedTodos = todos.filter(todo => !todo.completed);

      promises = completedTodos.map(todo =>
        updateTodo(todo.id, { ...todo, completed: true }),
      );
    }

    Promise.all(promises)
      .then(todosFromServer => {
        setTodos(prevState => {
          const ids = todosFromServer.map(todo => todo.id);
          const filteredById = prevState.filter(todo => !ids.includes(todo.id));

          return [...todosFromServer, ...filteredById];
        });
        todos.forEach(item => handleLoaderId(item));
      })
      .catch(err => {
        setCustomError(text.unableToUpdateTodo);
        todos.forEach(item => handleLoaderId(item));

        throw err;
      });
  }, [handleLoaderId, setCustomError, setTodos, todos]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          onClick={handleCompletedAll}
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          onChange={titleHandleChange}
          value={newTodo.title}
          ref={titleField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={disabled}
        />
      </form>
    </header>
  );
};

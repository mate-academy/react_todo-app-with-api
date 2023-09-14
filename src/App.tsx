/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';
import { useTodo } from './hooks/useTodo';
import { ErrorMessage } from './types/ErrorMessage';
import { Todo } from './types/Todo';

const USER_ID = 11340;

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    isChecked,
    setIsChecked,
    errorMessage,
    setErrorMessage,
    setIsProcessing,
  } = useTodo();

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD_ERROR));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(ErrorMessage.DEFAULT);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  setIsChecked(todos.every(todo => todo.completed) && todos.length > 0);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(ErrorMessage.DEFAULT);
    setNewTodoTitle(event.target.value);
  };

  const addNewTodo = (newTitle: string) => {
    const newTodoToAdd = {
      id: 0,
      userId: USER_ID,
      title: (newTitle),
      completed: false,
    };

    setTempTodo(newTodoToAdd);

    todoService.addTodo(newTodoToAdd)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.ADD_ERROR);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setNewTodoTitle('');
      });
  };

  const deleteSelectedTodo = (todoId: number): void => {
    setIsProcessing(currentIds => [...currentIds, todoId]);

    todoService.deleteTodo(todoId)
      .then(() => {
        setTodos(curentTodos => curentTodos.filter(item => item.id !== todoId));
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(ErrorMessage.DELETE_ERROR);
        throw error;
      })
      .finally(() => setIsProcessing([]));
  };

  const updateSelectedTodo = (updatedTodo: Todo): void => {
    setIsProcessing(currentIds => [...currentIds, updatedTodo.id]);

    todoService.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(item => item.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UPDATE_ERROR);
        throw error;
      })
      .finally(() => {
        setIsProcessing([]);
        setIsChecked(!isChecked);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = newTodoTitle.trim();

    if (!newTitle) {
      setErrorMessage(ErrorMessage.TITLE_ERROR);
      setNewTodoTitle('');

      return;
    }

    addNewTodo(newTitle);
  };

  const handleCheckAllTodos = () => {
    todos.forEach(todo => {
      const updatedTodo = {
        ...todo,
        completed: !isChecked,
      };

      updateSelectedTodo(updatedTodo);
    });
  };

  const activeTodosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosCounter = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const clearCompletedTodos = () => {
    todos.forEach(todo => todo.completed && deleteSelectedTodo(todo.id));
  };

  const handleDeleteErrorMessage = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isChecked,
            })}
            onClick={handleCheckAllTodos}
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={handleTitleChange}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList tempTodo={tempTodo} />

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodosCounter} item${activeTodosCounter === 1 ? '' : 's'} left`}
              </span>

              <TodoFilter />

              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompletedTodos}
                disabled={completedTodosCounter < 0}
              >
                {completedTodosCounter > 0 && 'Clear completed'}
              </button>
            </footer>
          </>
        )}
      </div>

      {errorMessage && (
        <div className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={handleDeleteErrorMessage}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

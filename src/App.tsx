/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoApp } from './components/TodoApp';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Status } from './types/Status';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11261;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [hasTitleError, setHasTitleError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.None);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingById, setLoadingById] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    todoService.getTodos(USER_ID).then(setTodos);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);
  }, []);

  const filterTodos = useMemo(() => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);
      case Status.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, status]);

  const deleteTodo = useCallback((id: number) => {
    setIsLoading(true);
    todoService.deleteTodo(id)
      .catch(() => setErrorMessage(ErrorMessage.Delete))
      .finally(() => setIsLoading(false));
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
  }, [setIsLoading, setErrorMessage, setTodos]);

  const createTodo = ({
    title,
    userId,
    completed,
  }: Todo) => {
    setTempTodo({
      id: 0,
      title,
      userId,
      completed,
    });
    todoService.createTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo as Todo]);
      })
      .catch(() => setErrorMessage(ErrorMessage.Add))
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleClearCompleted = () => {
    todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return todo;
    });
  };

  const updateTodo = (updatedTodo: Todo) => {
    todoService.updateTodo(updatedTodo)
      .then(changeTodo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(todo => todo.id === updatedTodo.id);

          newTodos.splice(index, 1, changeTodo as Todo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage(ErrorMessage.Update))
      .finally(() => {
        setLoadingById([]);
      });
  };

  const setCheckAll = () => {
    todos.map(todo => {
      setLoadingById([...loadingById, todo.id]);

      return updateTodo({ ...todo, completed: !selectAll });
    });

    setSelectAll(!selectAll);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: selectAll,
              })}
              onClick={setCheckAll}
            />
          )}

          <TodoApp
            createTodo={createTodo}
            userId={USER_ID}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setHasTitleError={setHasTitleError}
          />
        </header>

        {hasTitleError && (
          <p className="todo__title help is-danger">
            {'Title can\'t be empty'}
          </p>
        )}

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              deleteTodo={deleteTodo}
              tempTodo={tempTodo}
              updateTodo={updateTodo}
              loadingById={loadingById}
              setLoadingById={setLoadingById}
            />

            <TodoFooter
              filterTodos={filterTodos}
              setStatus={setStatus}
              status={status}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <div className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: ErrorMessage.None },
        )}
        >
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage(ErrorMessage.None)}
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

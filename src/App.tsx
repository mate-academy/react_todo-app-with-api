/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';
// eslint-disable-next-line object-curly-newline
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { USER_ID } from './constants/userid';
import { FILTERS } from './constants/filters';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<FILTERS>(FILTERS.ALL);
  const [preperedTodo, setPreperedTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoID, setDeleteTodoID] = useState<number | null>(null);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);
  const [toggleAll, setToggleAll] = useState<boolean>(false);

  useEffect(() => {
    setToggleAll(todos.every(todo => todo.completed));
  }, [todos]);

  const notCompletedTodoCount = todos.filter(todo => !todo.completed).length;
  const isCompletedExist = todos.length !== notCompletedTodoCount;
  const maxId = Math.max(...todos.map(todo => todo.id));

  const clearCompletedButtonStyles = !isCompletedExist
    ? {
      opacity: 0,
      cursor: 'default',
    }
    : {};

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (activeFilter) {
        case FILTERS.ACTIVE:
          return !todo.completed;
        case FILTERS.COMPLETED:
          return todo.completed;
        case FILTERS.ALL:
        default:
          return true;
      }
    });
  }, [todos, activeFilter]);

  const setErrorStates = (message: string, status: boolean) => {
    setErrorMessage(message);
    setIsError(status);
  };

  const handleErrorMessage = () => {
    setErrorStates('', false);
  };

  const loadTodos = async (): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    try {
      const todosFromserver = await getTodos(USER_ID);

      setTodos(todosFromserver);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const uploadTodo = async (): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    try {
      if (preperedTodo) {
        const newTodo = await addTodo(preperedTodo);

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setPreperedTodo(null);
        setTempTodo(null);
      }
    } catch (error) {
      setErrorStates('Unable to add a todo', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    uploadTodo();
  }, [preperedTodo]);

  const deleteTodos = async (): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    try {
      if (deleteTodoID) {
        await deleteTodo(deleteTodoID);

        setTodos(prevTodos => prevTodos.filter(
          ({ id }) => id !== deleteTodoID,
        ));
        setDeleteTodoID(null);
      }
    } catch (error) {
      setErrorStates('Unable to delete a todo', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    deleteTodos();
  }, [deleteTodoID]);

  const deleteCompletedTodos = async (): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    setIsDeletingCompleted(true);
    try {
      const completedTodos = todos.filter(todo => todo.completed);

      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));

      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      setErrorStates('Unable to delete a todo', true);
    } finally {
      setIsLoading(false);
      setIsDeletingCompleted(false);
    }
  };

  const handleCompletedDelete = () => {
    deleteCompletedTodos();
  };

  const updateTodoComplete = async (
    id: number,
    data: Partial<Todo>,
  ): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    try {
      const updetedTodo = await updateTodo(id, data);

      setTodos(prevTodos => prevTodos.map(todo => (
        todo.id !== updetedTodo.id
          ? todo
          : updetedTodo
      )));
    } catch (error) {
      setErrorStates('Unable to update a todo', true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAllTodosComplete = async (): Promise<void> => {
    setIsError(false);
    setIsLoading(true);
    try {
      // const changedTodos = todos.filter(todo => todo.completed !== toggleAll);

      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !toggleAll,
        };

        return updateTodoComplete(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !toggleAll,
      })));

      setToggleAll(!toggleAll);
    } catch (error) {
      setErrorStates('Unable to update a todo', true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorStates('', false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: toggleAll,
              })}
              onClick={updateAllTodosComplete}
            />
          )}

          <NewTodo
            maxId={maxId}
            onSetErrorStates={setErrorStates}
            onSetPreperedTodo={setPreperedTodo}
            onSetTempTodo={setTempTodo}
            isLoading={isLoading}
          />
        </header>

        {todos && (
          <section className="todoapp__main">
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              isPerentLoading={isLoading}
              onSetDeleteTodoID={setDeleteTodoID}
              deleteTodoID={deleteTodoID}
              isDeletingCompleted={isDeletingCompleted}
              onUpdateTodoComplete={updateTodoComplete}
            />
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${notCompletedTodoCount} items left`}
            </span>

            <Filter onSetActiveFilter={setActiveFilter} />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              style={clearCompletedButtonStyles}
              onClick={handleCompletedDelete}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        className={
          classNames('notification is-danger is-light has-text-weight-normal', {
            hidden: !isError,
          })
        }
      >
        <button
          type="button"
          className="delete"
          onClick={handleErrorMessage}
        />

        {errorMessage}

        {/* show only one message at a time */}
        {/* Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as Postservice from './api/todos';
import { Status } from './enum/Status';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorMessage } from './enum/ErrorMessages';
import { Error } from './components/Error/Error';
import { AddTodo } from './components/AddTodo';
import { setErrorWithTimeout } from './utils/setError';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11298;

const getFilterdTodos = (
  todos: Todo[],
  filterBy: Status,
) => {
  switch (filterBy) {
    case Status.active:
      return todos.filter(todo => !todo.completed);

    case Status.completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<Status>(Status.all);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [groupSelected, setGroupSelected] = useState<null | Todo[]>(null);

  useEffect(() => {
    setIsLoading(true);

    Postservice.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorWithTimeout(
        ErrorMessage.None,
        3000,
        setErrorMessage,
      ))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilterdTodos(todos, filterBy);
  }, [todos, filterBy]);

  const allAreCompleted = filteredTodos
    .filter(todo => todo.completed).length === todos.length;

  const updateTodo = (updatedTodo: Todo) => {
    setIsLoading(true);
    setSelectedTodo(updatedTodo);

    Postservice.updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];

          const index = newTodos
            .findIndex(current => current.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => setErrorWithTimeout(
        ErrorMessage.Update,
        3000,
        setErrorMessage,
      ))
      .finally(() => {
        setIsLoading(false);
        setSelectedTodo(null);
      });
  };

  const toggleAll = () => {
    const allComplete = todos.every(todo => todo.completed);

    const newTodos = todos.map((todo) => ({
      ...todo,
      completed: !allComplete,
    }));

    const todosToUpdate = newTodos.map(todo => Postservice.updateTodo(todo));

    setIsLoading(true);
    setGroupSelected(newTodos);

    Promise.all(todosToUpdate)
      .then(setTodos)
      .catch(() => setErrorWithTimeout(
        ErrorMessage.Update,
        3000,
        setErrorMessage,
      ))
      .finally(() => {
        setIsLoading(false);
        setGroupSelected(null);
      });
  };

  const deleteTodo = (id: number) => () => {
    setIsLoading(true);

    Postservice.deleteTodo(id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== id)))
      .catch((error) => {
        setErrorWithTimeout(
          ErrorMessage.Delete,
          3000,
          setErrorMessage,
        );

        throw error;
      })
      .finally(() => setIsLoading(false));
  };

  const deleteAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsLoading(true);
    setGroupSelected(completedTodos);

    const deletePromises = completedTodos
      .map(todo => Postservice.deleteTodo(todo.id));

    Promise.all(deletePromises)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => !todo.completed)))
      .catch((error) => {
        setErrorWithTimeout(
          ErrorMessage.Delete,
          3000,
          setErrorMessage,
        );

        throw error;
      })
      .finally(() => {
        setIsLoading(false);
        setGroupSelected(null);
      });
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
              active: allAreCompleted,
            })}
            onClick={toggleAll}
          />
          <AddTodo
            setTodos={setTodos}
            todos={todos}
            userId={USER_ID}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          isLoading={isLoading}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          updateTodo={updateTodo}
          groupSelected={groupSelected}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            isLoading={isLoading}
            deleteTodo={deleteTodo}
            selectedTodo={selectedTodo}
            setSelectedTodo={setSelectedTodo}
            updateTodo={updateTodo}
            groupSelected={groupSelected}
          />
        )}

        <Footer
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          todos={todos}
          deleteAllCompleted={deleteAllCompleted}
        />
      </div>

      {errorMessage && !isLoading && (
        <Error
          error={errorMessage}
          setError={setErrorMessage}
        />
      )}
    </div>
  );
};

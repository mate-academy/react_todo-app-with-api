/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import * as todosApiServices from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { TodosCounter } from './components/TodosCounter';
import { ClearCompleted } from './components/ClearCompleted';
import { ToggleAll } from './components/ToggleAll';

export const USER_ID = 12146;

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [loadingTodosPause, setLoadingTodosPause] = useState<number[]>([]);

  const hasCompletedTodos
    = todos?.some(({ completed }) => completed === true);

  useEffect(() => {
    setErrorMessage(null);
  }, [filter, todos]);

  function loadPosts() {
    setLoading(true);

    todosApiServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.UnableToLoadTodos))
      .finally(() => setLoading(false));
  }

  useEffect(loadPosts, []);

  const addTodo = useCallback((title: string): Promise<void> => {
    setLoadingTodosPause(prev => [...prev, 0]);
    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
      id: 0,
    };

    setTempTodo({ ...newTodo });

    return todosApiServices.addTodo(newTodo)
      .then((response) => setTodos(
        currentTodos => [...currentTodos, response],
      ))
      .then(() => setTempTodo(null))
      .catch(() => {
        setErrorMessage(Errors.UnableToAddATodo);
        throw new Error(Errors.UnableToAddATodo);
      })
      .finally(
        () => setLoadingTodosPause(prevIds => prevIds
          .filter(prevId => prevId !== 0)),
      );
  }, []);

  const deleteTodo = (todoId: number) => {
    setLoadingTodosPause(prev => [...prev, todoId]);

    return todosApiServices.deleteUserTodo(todoId)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(todo => todo.id !== todoId)))
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Errors.UnabletoDeleteATodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodosPause(
          prev => prev.filter(loadingId => loadingId !== todoId),
        );
      });
  };

  const clearCompletedTodos = async () => {
    const completedTodos
      = todos?.filter(({ completed }) => completed);

    if (completedTodos?.length) {
      Promise.all(
        completedTodos.map((todo) => deleteTodo(todo.id)),
      )
        .catch(() => {
          setErrorMessage(Errors.UnabletoDeleteATodo);
        });
    }
  };

  const updateTodo = (updatedTodo: Todo) => {
    setLoadingTodosPause(currentTodo => [...currentTodo, updatedTodo.id]);

    return todosApiServices.updateTodo(updatedTodo)
      .then(() => setTodos(prev => (
        prev.map(prevTodo => (
          prevTodo.id === updatedTodo.id
            ? updatedTodo
            : prevTodo
        ))
      )))
      .catch(() => setErrorMessage(Errors.UnableToUpdateATodo))
      .finally(() => {
        setLoadingTodosPause(currentTodos => currentTodos
          .filter(todoId => updatedTodo.id !== todoId));
      });
  };

  const toggleAll = async () => {
    const isAllCompleted = todos
      .every(todo => todo.completed);

    const updatedTodos = todos
      .filter(todo => isAllCompleted === todo.completed);

    await Promise.all(updatedTodos.map(todo => (
      updateTodo({
        ...todo,
        completed: !isAllCompleted,
      })
    )));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {!!todos.length && (
            <ToggleAll
              onToggleAll={toggleAll}
              todos={todos}
            />
          )}

          {/* Add a todo on form submit */}
          <TodoInput
            onSubmit={addTodo}
            setHasTitleError={setErrorMessage}
          />
        </header>

        {!loading
          && todos
          && (
            <TodoList
              todos={todos}
              filter={filter}
              onDelete={deleteTodo}
              tempTodo={tempTodo}
              loadingTodosPause={loadingTodosPause}
              onUpdateTodo={updateTodo}
            />
          )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0
          && (
            <footer className="todoapp__footer" data-cy="Footer">
              <TodosCounter todos={todos} />

              {/* Active filter should have a 'selected' class */}
              <TodoFilter
                filter={filter}
                setFilter={setFilter}
              />

              {/* don't show this button if there are no completed todos */}
              <ClearCompleted
                hasCompletedTodos={hasCompletedTodos}
                clearCompletedTodos={clearCompletedTodos}
              />
            </footer>
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};

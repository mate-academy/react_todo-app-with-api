/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import {
  createTodo, getTodos, removeTodo, updatingTodo,
}
  from './api/todos';
import { Filters } from './types/enumFilter';
import { Filter } from './components/Filter/Filter';
// eslint-disable-next-line
import { ErrorNotification } from './components/Notification/ErrorNotification';
import { prepareTodos } from './utils/prepareTodos';
import { AddTodoForm } from './components/AddTodoForm';

const USER_ID = 11241;
const ERROR_MESSAGES = {
  UnableToLoad: 'Unable to load a todo',
  UnableToDelete: 'Unable to delete a todo',
  UnableToUpdate: 'Unable to update a todo',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteringField, setFilteringField] = useState(Filters.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const someCompleted = todos.some(todo => todo.completed);
  const everyCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ERROR_MESSAGES.UnableToLoad);
      });
  }, []);

  const visibletodos = useMemo(
    () => prepareTodos(todos, filteringField), [todos, filteringField],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodoCount = (currentTodos: Todo[]) => {
    return currentTodos.filter(todo => !todo.completed).length;
  };

  const addTodo = (todo: Todo) => {
    setLoading(true);
    setTempTodo(todo);

    return createTodo(todo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => setErrorMessage(ERROR_MESSAGES.UnableToLoad))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const deleteCompletedTodos = (todoId: number) => {
    setLoadingTodoIds(ids => [...ids, todoId]);

    return removeTodo(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorMessage(ERROR_MESSAGES.UnableToDelete))
      .finally(() => setLoadingTodoIds(ids => ids.filter(id => id !== todoId)));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setLoadingTodoIds(currentIds => [...currentIds, updatedTodo.id]);

    return updatingTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            currentTodo => currentTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => setErrorMessage(ERROR_MESSAGES.UnableToUpdate))
      .finally(() => setLoadingTodoIds(
        currentIds => currentIds.filter(id => {
          return id !== updatedTodo.id;
        }),
      ));
  };

  const deleteCompletedTodo = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(completedIds);

    completedIds.forEach(id => deleteCompletedTodos(id));
  };

  const toggleAllHandler = () => {
    const newCompletedStatus = !everyCompleted;

    todos.forEach(todo => updateTodo(
      { ...todo, completed: newCompletedStatus },
    ));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {
            todos.length !== 0
            && (
              <button
                type="button"
                className={
                  classNames(
                    'todoapp__toggle-all',
                    {
                      active: everyCompleted,
                    },
                  )
                }
                onClick={toggleAllHandler}
              />
            )
          }

          <AddTodoForm
            setErrorMessage={setErrorMessage}
            userId={USER_ID}
            addTodo={addTodo}
            loading={loading}
          />
        </header>

        {todos.length !== 0
          && (
            <TodoList
              todos={visibletodos}
              tempTodo={tempTodo}
              deleteTodo={deleteCompletedTodos}
              updateTodo={updateTodo}
              loadingTodoIds={loadingTodoIds}
            />
          )}

        {todos.length !== 0
          && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${activeTodoCount(todos)} items left`}
              </span>

              <Filter
                filteringField={filteringField}
                setFilteringField={setFilteringField}
              />

              {someCompleted
                && (
                  <button
                    type="button"
                    className="todoapp__clear-completed"
                    onClick={deleteCompletedTodo}
                  >
                    Clear completed
                  </button>
                )}
            </footer>
          )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

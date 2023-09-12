/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { USER_ID } from './constants';
import { Completion, Todo, TodoError } from './types';

import {
  getTodosFromServer,
  addTodoToServer,
  deleteTodoFromServer,
  updateTodoOnServer,
} from './api/todos';

import {
  ErrorNotification, TodoFilter, TodoForm, TodoList,
} from './components';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(TodoError.NoError);
  const [completionFilter, setCompletionFilter] = useState(Completion.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodosFromServer(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(TodoError.Load));
  }, []);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed)
  ), [todos]);

  const visibleTodos = useMemo(() => {
    switch (completionFilter) {
      case Completion.Active:
        return activeTodos;
      case Completion.Completed:
        return completedTodos;
      default:
        return todos;
    }
  }, [todos, completionFilter]);

  const addTodo = async (newTodo: Todo) => {
    return addTodoToServer(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);

        return todoFromServer;
      })
      .catch(error => {
        setErrorMessage(TodoError.Add);
        throw error;
      });
  };

  const deleteTodo = (todoId: number) => {
    return deleteTodoFromServer(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));

        return todoId;
      })
      .catch(error => {
        setErrorMessage(TodoError.Delete);
        throw error;
      });
  };

  const updateTodo = async (updatedTodo: Todo) => {
    return updateTodoOnServer(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => currentTodos.map(todo => (
          todo.id === todoFromServer.id
            ? todoFromServer
            : todo
        )));

        return todoFromServer;
      })
      .catch(error => {
        setErrorMessage(TodoError.Update);
        throw error;
      });
  };

  const deleteCompletedTodos = () => {
    setLoadingTodoIds(completedTodos.map(todo => todo.id));

    Promise.all(completedTodos.map(completedTodo => (
      deleteTodo(completedTodo.id)
    )))
      .catch(() => setErrorMessage(TodoError.Delete))
      .finally(() => setLoadingTodoIds([]));
  };

  const isEverythingCompleted = todos.length === completedTodos.length;

  const toggleAll = () => {
    const todosToToggle = isEverythingCompleted ? todos : activeTodos;

    setLoadingTodoIds(todosToToggle.map(todo => todo.id));

    Promise.all(todosToToggle.map(todo => {
      const toggledTodo: Todo = {
        ...todo,
        completed: !todo.completed,
      };

      return updateTodo(toggledTodo);
    }))
      .catch(() => setErrorMessage(TodoError.Update))
      .finally(() => setLoadingTodoIds([]));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isEverythingCompleted,
              })}
              onClick={toggleAll}
            />
          )}

          <TodoForm
            addTodo={addTodo}
            onEmptyTitle={() => setErrorMessage(TodoError.EmptyTitle)}
            setTempTodo={setTempTodo}
          />
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            loadingTodoIds={loadingTodoIds}
          />
        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              completionFilter={completionFilter}
              setCompletionFilter={setCompletionFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={completedTodos.length === 0}
              onClick={deleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          clearError={() => setErrorMessage(TodoError.NoError)}
        />
      )}
    </div>
  );
};

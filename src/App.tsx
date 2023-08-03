/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Completion } from './types/Completion';
import { TodoError } from './types/TodoError';
import { USER_ID } from './constants';
import {
  deleteTodoFromServer,
  getTodosFromServer,
  updateTodoOnServer,
} from './api/todos';

import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { NotificationError } from './components/NotificationError';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState(TodoError.NoError);
  const [completionFilter, setCompletionFilter] = useState(Completion.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

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

  const addTodo = (newTodo: Todo) => {
    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => (
      currentTodos.filter(todo => todo.id !== todoId)
    ));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(currentTodos => currentTodos.map(todo => (
      todo.id === updatedTodo.id ? updatedTodo : todo
    )));
  };

  const deleteCompletedTodos = () => {
    setLoadingTodos(completedTodos.map(todo => todo.id));

    Promise.all(completedTodos.map(completedTodo => (
      deleteTodoFromServer(completedTodo.id)
        .then(() => deleteTodo(completedTodo.id))
    )))
      .catch(() => setErrorMessage(TodoError.Delete))
      .finally(() => setLoadingTodos([]));
  };

  const isEverythingCompleted = todos.length === completedTodos.length;

  const toggleAll = () => {
    const todosToToggle = isEverythingCompleted ? todos : activeTodos;

    setLoadingTodos(todosToToggle.map(todo => todo.id));

    Promise.all(todosToToggle.map(todo => {
      const updatedTodo: Todo = {
        ...todo,
        completed: !todo.completed,
      };

      return updateTodoOnServer(updatedTodo)
        .then(todoFromServer => updateTodo(todoFromServer));
    }))
      .catch(() => setErrorMessage(TodoError.Update))
      .finally(() => setLoadingTodos([]));
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
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
          />
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deleteTodo={deleteTodo}
            setErrorMessage={setErrorMessage}
            updateTodo={updateTodo}
            loadingTodos={loadingTodos}
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
        <NotificationError
          errorMessage={errorMessage}
          clearError={() => setErrorMessage(TodoError.NoError)}
        />
      )}
    </div>
  );
};

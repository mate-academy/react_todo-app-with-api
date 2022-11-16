/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { ErrorNotification } from './components/ErrorNotifications';
import { TodoFooter } from './components/TodoFooter';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [hasError, setHasError] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTodoId, setselectedTodoId] = useState<number[]>([]);
  const tempTodo = {
    id: 0,
    title: '',
    completed: false,
    userId: 0,
  };
  const [temproraryTodo, setTemporaryTodo] = useState<Todo>(tempTodo);

  const getTodosFromServer = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasError(true);
        setErrorMessage('Can not load todos from server');
      }
    }
  };

  const deleteErrors = useCallback(() => {
    return setHasError(false);
  }, []);

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Completed:
          return todo.completed;
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.All:
        default:
          return todo;
      }
    })
  ), [todos, filterBy]);

  const handleFilter = useCallback((filter: FilterBy) => {
    setFilterBy(filter);
  }, []);

  useEffect(() => {
    getTodosFromServer();

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const handleSumbitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      setErrorMessage('Title can not be empty');
      setHasError(true);
    }

    if (user && todoTitle.trim() && temproraryTodo) {
      try {
        setIsAdding(true);
        setTemporaryTodo((currentTemp => ({
          ...currentTemp,
          title: todoTitle.trim(),
          userId: user.id,
        })));
        const newTodo = {
          title: todoTitle.trim(),
          completed: false,
          userId: user?.id,
        };

        await addTodo(user.id, newTodo);
        await getTodosFromServer();
        setIsAdding(false);
        setTodoTitle('');
      } catch (error) {
        setErrorMessage('Unable to add todo');
        setHasError(true);
      }
    }
  };

  const handleUpdateTodoStatus = async (todo: Todo) => {
    try {
      setselectedTodoId((curr) => [...curr, todo.id]);
      await updateTodo(todo.id, {
        completed: !todo.completed,
      });
      await getTodosFromServer();
      setselectedTodoId(curr => (
        curr.filter((id) => id !== todo.id)
      ));
    } catch (error) {
      setErrorMessage('Unable to update todo status');
      setHasError(true);
    }
  };

  const handleDeleteButton = async (todoId: number) => {
    try {
      setselectedTodoId(currentTodo => [...currentTodo, todoId]);
      await deleteTodo(todoId);
      await getTodosFromServer();
      setselectedTodoId(curr => (
        curr.filter((id) => id !== todoId)
      ));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setHasError(true);
    }
  };

  const completedTodos = (todos.filter((todo) => todo.completed));

  const removeAllCompletedTodos = async () => {
    try {
      await Promise.all(completedTodos.map((todo) => (
        handleDeleteButton(todo.id)
      )));
    } catch (error) {
      setErrorMessage('Unable to remove all completed todo');
      setHasError(true);
    }
  };

  const handleUpdateAllTodosStatus = async () => {
    try {
      const todoChangeStatus = completedTodos.length !== todos.length
        ? todos.filter((todo) => !todo.completed)
        : todos;

      await Promise.all(todoChangeStatus
        .map((todo) => handleUpdateTodoStatus(todo)));
    } catch (error) {
      setErrorMessage('Unable to update all todos status');
      setHasError(true);
    }
  };

  const handleNewTodoTitle = async (todo: Todo, newTodoTitle: string) => {
    try {
      setselectedTodoId(curr => [...curr, todo.id]);

      await updateTodo(todo.id, { title: newTodoTitle.trim() });
      await getTodosFromServer();
      setselectedTodoId(curr => (
        curr.filter((id) => id !== todo.id)
      ));
    } catch (error) {
      setErrorMessage('Unable to update all todos title');
      setHasError(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setHasError(false);
    }, 3000);
  }, [hasError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: completedTodos.length === todos.length,
            })}
            onClick={handleUpdateAllTodosStatus}
          />

          <form
            action="/api/todos"
            method="POST"
            onSubmit={handleSumbitForm}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => (setTodoTitle(event.target.value))}
            />
          </form>
        </header>
        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              handleDeleteButton={handleDeleteButton}
              temporaryTodo={temproraryTodo}
              isAdding={isAdding}
              selectedTodoId={selectedTodoId}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              handleNewTodoTitle={handleNewTodoTitle}
            />
            <TodoFooter
              filterBy={filterBy}
              handleFilter={handleFilter}
              todos={todos.length}
              removeAllCompletedTodos={removeAllCompletedTodos}
              completedTodos={completedTodos.length}
            />
          </>
        )}

      </div>
      {hasError && (
        <ErrorNotification
          deleteErrors={deleteErrors}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoadingTodos, setIsLoadingTodos] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const ShowErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => ShowErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getTodos(user.id)
      .then(setTodos);
  }, [user]);

  const addNewTodo = async (event: FormEvent) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    if (!todoTitle) {
      ShowErrorMessage('Title cant be empty');

      // eslint-disable-next-line no-useless-return
      return;
    }

    const optimisticResponseId = -(todos.length);

    const newTodo = {
      id: optimisticResponseId,
      userId: user.id,
      title: todoTitle,
      completed: false,
    };

    setTodos(prev => [...prev, newTodo]);
    setIsLoadingTodos(prev => [...prev, optimisticResponseId]);

    try {
      const createdTodo = await createTodo(user.id, todoTitle, false);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === optimisticResponseId) {
          return createdTodo;
        }

        return todo;
      }));
    } catch {
      setTodos(prevTodos => prevTodos.filter(todo => (
        todo.id !== optimisticResponseId)));
      ShowErrorMessage('Unable to add a todo');
    }

    setTodoTitle('');
    setIsLoadingTodos(prev => prev.filter(curr => curr !== newTodo.id));
  };

  const removeTodo = useCallback(async (todoId: number) => {
    setIsLoadingTodos(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(
        currentTodo => currentTodo.id !== todoId,
      ));
    } catch {
      ShowErrorMessage('Unable to delete todo');
    }

    setIsLoadingTodos(todosId => todosId.filter(curr => curr !== todoId));
  }, [deleteTodo]);

  const changeTodo = useCallback(async (id: number, data: any) => {
    setIsLoadingTodos(todosId => [...todosId, id]);

    const updatedTodo = await updateTodo(id, data);

    setTodos(prev => prev.map(todo => {
      if (todo.id === id) {
        return updatedTodo;
      }

      return todo;
    }));

    setIsLoadingTodos(todosId => todosId.filter(curr => curr !== id));
  }, [updateTodo]);

  const visibleTodos = todos.filter(todo => {
    switch (sortBy) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return todos;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form onSubmit={addNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => {
                setTodoTitle(event.target.value);
                ShowErrorMessage('');
              }}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              changeTodo={changeTodo}
              loadingTodosId={isLoadingTodos}
            />
          ))}
        </section>

        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            4 items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className="filter__link selected"
            >
              All
            </a>

            <a
              data-cy="FilterLinkActive"
              href="#/active"
              className="filter__link"
            >
              Active
            </a>
            <a
              data-cy="FilterLinkCompleted"
              href="#/completed"
              className="filter__link"
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
          >
            Clear completed
          </button>
        </footer>
      </div>

      <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div>
    </div>
  );
};

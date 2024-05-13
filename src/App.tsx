/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
} from './api/todos';
import { TodoList } from './Components/TodoList';
import { ErrorNotification } from './Components/ErrorNotification';
import { Footer } from './Components/Footer';
import { Status, Todo, Error } from './Types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Status>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [focus, setFocus] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [addNewTodo, setAddNewTodo] = useState<boolean>(false);
  const [loadingAddTodoId, setLoadingAddTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deleteFewTodo, setDeleteFewTodo] = useState<number[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await getTodos();

        setTodos(todosData);
      } catch (err) {
        setError(true);
        setErrorType('load');
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (focus) {
      const inputField = document.querySelector(
        '.todoapp__new-todo',
      ) as HTMLElement;

      if (inputField) {
        inputField.focus();
      }
    }
  }, [focus]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const trimmedTodo = newTodoTitle.trim();

    if (event.key === 'Enter') {
      event.preventDefault();

      if (trimmedTodo) {
        setFocus(false);

        try {
          setAddNewTodo(true);

          const newTodo: Todo = {
            id: 0,
            userId: USER_ID,
            title: trimmedTodo,
            completed: false,
          };

          setTempTodo(newTodo);

          const response = await postTodo(newTodo);

          setLoadingAddTodoId(response.id);

          setTodos(prevTodos => [...prevTodos, response]);
          setNewTodoTitle('');
          setTempTodo(null);
          setAddNewTodo(false);

          setLoadingAddTodoId(null);
          setFocus(true);
        } catch (err) {
          setError(true);
          setErrorType('add');
          setAddNewTodo(false);
          setFocus(true);
        }
      } else {
        setError(true);
        setErrorType('empty');
        setFocus(true);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const onClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let errorAll = false;

    for (const todo of completedTodos) {
      try {
        await deleteTodo(todo.id);
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
      } catch (err) {
        setError(true);
        setErrorType('delete');
        errorAll = true;
      }
    }

    if (errorAll) {
      setError(true);
      setErrorType('delete');
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFilterChange = (newFilter: Status) => {
    setFilter(newFilter);
  };

  const handleDeleteTodo = async (id: number) => {
    setDeleteFewTodo(prev => [...prev, id]);
    setLoadingTodoId(id);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setDeleteFewTodo(prev => prev.filter(todoId => todoId !== id));
      setLoadingTodoId(null);
    }
  };

  const handleToggleTodo = async (id: number) => {
    setLoadingTodoId(id);

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, pendingToggle: true } : todo,
      ),
    );

    try {
      await updateTodo(id, !todos.find(todo => todo.id === id)?.completed);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === id
            ? { ...todo, completed: !todo.completed, pendingToggle: false }
            : todo,
        ),
      );
    } catch (err) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, pendingToggle: false } : todo,
        ),
      );
      setError(true);
      setErrorType('update');
    } finally {
      setLoadingTodoId(null);
    }
  };

  const handleToggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    try {
      if (
        todos.some(todo => !todo.completed) &&
        todos.some(todo => todo.completed)
      ) {
        const incompleteTodos = todos.filter(todo => !todo.completed);

        for (const todo of incompleteTodos) {
          await updateTodo(todo.id, true);
        }

        setTodos(prev => prev.map(todo => ({ ...todo, completed: true })));
      } else {
        for (const todo of todos) {
          await updateTodo(todo.id, !allCompleted);
        }

        setTodos(prev =>
          prev.map(todo => ({ ...todo, completed: !allCompleted })),
        );
      }
    } catch (err) {
      setError(true);
      setErrorType('update');
    }
  };

  const updateTodoTitle = async (id: number, newTitle: string) => {
    setLoading(true);
    try {
      await updateTodo(id, addNewTodo);
      const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, title: newTitle };
        }

        return todo;
      });

      setTodos(updatedTodos);
    } catch (err) {
      setError(true);
      setErrorType('update');
    } finally {
      setLoading(false);
    }
  };

  const hideError = () => {
    setError(false);
  };

  return (
    <div className="todoapp">
      {!USER_ID && <UserWarning />}
      <h1 className="todoapp__title">todos</h1>
      {USER_ID && (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this button should have `active` class only if all todos are completed */}

            {todos.length > 0 && (
              <button
                type="button"
                className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
                data-cy="ToggleAllButton"
                onClick={handleToggleAllTodos}
              />
            )}
            {/* Add a todo on form submit */}
            <form>
              <input
                ref={inputRef}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                onKeyDown={handleKeyDown}
                value={newTodoTitle}
                onChange={handleChange}
                autoFocus
                disabled={!focus}
              />
            </form>
          </header>
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
            filter={filter}
            loading={loading}
            setError={setError}
            setErrorType={setErrorType}
            handleDeleteTodo={handleDeleteTodo}
            loadingTodoId={loadingTodoId}
            loadingAddTodoId={loadingAddTodoId}
            addNewTodo={addNewTodo}
            setFocus={setFocus}
            setLoadingTodoId={setLoadingTodoId}
            tempTodo={tempTodo}
            setLoading={setLoading}
            deleteFewTodo={deleteFewTodo}
            updateTodoTitle={updateTodoTitle}
          />
          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <Footer
              filter={filter}
              todosCount={todos.length}
              completedTodosCount={todos.filter(todo => todo.completed).length}
              onClearCompleted={onClearCompleted}
              handleFilterChange={handleFilterChange}
            />
          )}
        </div>
      )}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        error={error}
        errorType={errorType}
        hideError={hideError}
      />
    </div>
  );
};

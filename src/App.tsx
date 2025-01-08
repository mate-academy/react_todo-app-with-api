import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import * as Methods from './api/todos';
import { FilterStatus } from './types/FilterStatus';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [counter, setCounter] = useState<number>(0);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const updateCounter = (arrTodo: Todo[]) => {
    const activeTodosCount = arrTodo.filter(todo => !todo.completed).length;

    setCounter(activeTodosCount);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
        updateCounter(fetchedTodos);
      } catch {
        setError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const deleteTodo = (todoId: number) => {
    setLoadingTodoId(todoId);

    Methods.deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        updateCounter(todos.filter(todo => todo.id !== todoId));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setLoadingTodoId(null));
  };

  const addTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    if (newTodoTitle.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    const trimmedTitle = newTodoTitle.trim();
    const tempId = Math.random();
    const tempTodoToAdd = {
      id: tempId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTodos([...todos, tempTodoToAdd]);
    setLoadingTodoId(tempId);
    setIsInputDisabled(true);

    try {
      const newTodo = await Methods.addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === tempId ? newTodo : todo)),
      );
      setNewTodoTitle('');
      updateCounter([...todos, tempTodoToAdd]);
    } catch {
      setError('Unable to add a todo');
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== tempId));
    } finally {
      setLoadingTodoId(null);
      setIsInputDisabled(false);
    }
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletionPromises = completedTodos.map(todo =>
      Methods.deleteTodo(todo.id).catch(() => todo.id),
    );

    Promise.all(deletionPromises)
      .then(results => {
        const failedDeletions = results.filter(
          result => typeof result === 'number',
        );

        if (failedDeletions.length > 0) {
          setError('Unable to delete a todo');
        }

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !todo.completed || failedDeletions.includes(todo.id),
          ),
        );
        updateCounter(todos);
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  const filteredTodos = todos.filter(todo => {
    switch (statusFilter) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const toggleTodo = (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    setTodos(
      todos.map(t => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
    );
    updateCounter(
      todos.map(t => (t.id === todoId ? { ...t, completed: !t.completed } : t)),
    );
  };

  const updateTodo = async (
    todoId: number,
    updatedFields: Partial<Todo>,
  ): Promise<Todo> => {
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, ...updatedFields } : todo,
        ),
      );

      updateCounter(
        todos.map(todo =>
          todo.id === todoId ? { ...todo, ...updatedFields } : todo,
        ),
      );
      const updatedTodo = await Methods.updateTodo(todoId, updatedFields);

      return updatedTodo;
    } catch {
      setError('Unable to update a todo');
      throw new Error('Unable to update a todo.');
    }
  };

  const hideError = () => setError(null);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const toggleAllTodos = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const updatedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== updatedStatus,
    );

    try {
      for (const todo of todosToUpdate) {
        await Methods.updateTodo(todo.id, { completed: updatedStatus });
      }

      const updatedTodos = todos.map(todo => ({
        ...todo,
        completed: updatedStatus,
      }));

      setTodos(updatedTodos);
      updateCounter(updatedTodos);
    } catch {
      setError('Unable to update todos');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          addTodo={addTodo}
          isInputDisabled={isInputDisabled}
          todos={todos}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
          error={error}
          setError={setError}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            counter={counter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredTodos={todos}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};

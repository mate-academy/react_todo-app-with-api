import React, { useState, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Filter } from './utils/Filter';
import { Todo } from './types/Todo';
import { getTodos, deleteTodo, patchTodo } from './api/todos';
import { Errors } from './utils/Errors';
import { Loader } from './components/Loader';

const USER_ID = 9934;

const visibleTodos = (todos: Todo[], selectedFilter: Filter) => {
  switch (selectedFilter) {
    case Filter.Active:
      return todos.filter((todo) => !todo.completed);
    case Filter.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState(Errors.NoError);
  const [isLoading, setIsLoading] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(Errors.Updating))
      .finally(() => setIsLoading(false));
  }, []);

  const updateTodoOnServer = async (todoId: number, data: Partial<Todo>) => {
    setLoadingTodos(prev => [...prev, todoId]);

    try {
      await patchTodo(todoId, data);

      setTodos((prevTodos) => prevTodos.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setError(Errors.Updating);

      setError(Errors.NoError);
    } finally {
      setLoadingTodos([]);
    }
  };

  const onDelete = (todoId: number) => {
    setDeletingTodoId(todoId);
    deleteTodo(USER_ID, todoId)
      .then(() => setTodos(todos.filter(todo => todo.id !== todoId)))
      .catch(() => setError(Errors.Deleting))
      .finally(() => {
        setDeletingTodoId(null);
      });
  };

  const onClearCompleted = () => {
    setIsLoading(true);
    const completedTodoIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    Promise.all(completedTodoIds.map(id => deleteTodo(USER_ID, id)))
      .then(() => setTodos(todos.filter(todo => !todo.completed)))
      .catch(() => setError(Errors.Deleting))
      .finally(() => setIsLoading(false));
  };

  const updateTodo = (updatedTodo: Todo) => {
    const updatedTodos = todos.map((todo) => (
      todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo
    ));

    setTodos(updatedTodos);
  };

  const handleCompleteAll = async () => {
    try {
      setLoadingTodos(todos.map(todo => todo.id));
      const updates = { completed: !allCompleted };

      await Promise.all(
        todos
          .filter((todo) => !todo.completed)
          .map((todo) => patchTodo(todo.id, updates)),
      );

      setTodos((data) => data.map((todo) => ({ ...todo, ...updates })));
      setAllCompleted(!allCompleted);
      setLoadingTodos([]);
    } catch {
      setError(Errors.Updating);
      setLoadingTodos([]);
    }
  };

  const addLoadingTodo = (todoId: number) => {
    setLoadingTodos(prevLoadingTodos => [...prevLoadingTodos, todoId]);
  };

  const removeLoadingTodo = (todoId: number) => {
    setLoadingTodos(
      prevLoadingTodos => prevLoadingTodos.filter(id => id !== todoId),
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodoItems = visibleTodos(todos, selectedFilter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTodos={setTodos}
          todos={todos}
          setError={setError}
          isLoading={isLoading}
          handleCompleteAll={handleCompleteAll}
        />

        {isLoading ? <Loader />
          : (
            <TodoList
              todos={visibleTodoItems}
              onDelete={onDelete}
              updateTodo={updateTodo}
              removeLoadingTodo={removeLoadingTodo}
              updateTodoOnServer={updateTodoOnServer}
              addLoadingTodo={addLoadingTodo}
              loadingTodos={loadingTodos}
              deletingTodoId={deletingTodoId}
              isLoading={isLoading}
            />
          )}

        {(!!todos.length) && (
          <Footer
            visibleTodos={visibleTodoItems}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onClearCompleted={onClearCompleted}
          />
        )}
      </div>

      {error && <Notification message={error} />}
    </div>
  );
};

/* eslint-disable no-param-reassign */
import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  FormEvent,
  useCallback,
} from 'react';
import {
  getTodos,
  createTodo,
  deleteTodo,
  patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './types/Error';
import { FilterType } from './types/Filter';
import Header from './components/Header';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import Footer from './components/Footer';
import { AuthContext } from './components/Auth/AuthContext';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  let userId = 0;

  if (user?.id) {
    userId = user?.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(setTodos)
      .catch(() => setError(Error.Connect));

    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = todos.filter(todo => {
    switch (filterType) {
      case FilterType.Active:
        return !todo.completed;

      case FilterType.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const handleAddTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(Error.Title);
      setTitle('');

      return;
    }

    setIsLoading(true);

    try {
      const todoToAdd = await createTodo(userId, title);

      setSelectedId(todoToAdd.id);

      setTodos(prev => [...prev, todoToAdd]);
    } catch {
      setError(Error.Add);
    } finally {
      setTitle('');
      setIsLoading(false);
    }
  }, [title]);

  const handleRemoveTodo = async (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    try {
      await deleteTodo(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTodo = async (todoId: number, data: Partial<Todo>) => {
    setIsLoading(true);
    setSelectedId(todoId);

    try {
      const newTodo = await patchTodo(todoId, data);

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? newTodo
          : todo
      )));
    } catch {
      setError(Error.Update);
    } finally {
      setIsLoading(false);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);

  const handleToggleAll = () => {
    if (activeTodos.length) {
      todos.map(todo => patchTodo(todo.id, { completed: true }));
      setTodos(todos.map(todo => {
        todo.completed = true;

        return todo;
      }));
    } else {
      todos.map(todo => patchTodo(todo.id, { completed: false }));
      setTodos(todos.map(todo => {
        todo.completed = false;

        return todo;
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          newTodoField={newTodoField}
          addTodo={handleAddTodo}
          toggleAll={handleToggleAll}
          title={title}
          setTitle={setTitle}
          isLoading={isLoading}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            removeTodo={handleRemoveTodo}
            onUpdate={handleUpdateTodo}
            isLoading={isLoading}
            selectedId={selectedId}
          />
        )}

        <Footer
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          removeTodo={handleRemoveTodo}
        />
      </div>

      <ErrorNotification
        error={error}
        setError={setError}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

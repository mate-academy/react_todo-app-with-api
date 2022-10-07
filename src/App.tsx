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
import TodoPanel from './components/TodoPanel';
import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';
import Filter from './components/Filter';
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
  const [toggleLoader, setToggleLoader] = useState(false);

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
      setTodos(prevState => [...prevState, todoToAdd]);
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

      setTodos(prevState => prevState.filter(todo => todo.id !== todoId));
    } catch {
      setError(Error.Delete);
    } finally {
      setIsLoading(false);
      setToggleLoader(false);
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
      setToggleLoader(false);
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);

  const handleToggleAll = () => {
    setToggleLoader(true);

    try {
      if (activeTodos.length) {
        setTodos(todos.map(todo => {
          handleUpdateTodo(todo.id, { completed: true });
          todo.completed = true;

          return todo;
        }));
      } else {
        setTodos(todos.map(todo => {
          handleUpdateTodo(todo.id, { completed: false });
          todo.completed = false;

          return todo;
        }));
      }
    } catch {
      setError(Error.Update);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoPanel
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
            toggleLoader={toggleLoader}
          />
        )}

        <Filter
          todos={todos}
          filterType={filterType}
          setFilterType={setFilterType}
          removeTodo={handleRemoveTodo}
          setToggleLoader={setToggleLoader}
        />
      </div>

      <ErrorNotification
        errorDetected={error}
        setError={setError}
      />
    </div>
  );
};

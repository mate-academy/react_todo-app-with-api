import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { FilterStatusEnum } from './types/Status.enum';
import { ErrorsEnum } from './types/Error.enum';
import { todosApi, USER_ID } from './api/todos';
import { filterTodos } from './utils/filterTodos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';

export const App: FC = () => {
  const todoFieldRef = useRef<HTMLInputElement | null>(null);
  const [filterStatus, setFilterStatus] = useState(FilterStatusEnum.All);
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorsEnum | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const filteredTodos = filterTodos(todos, filterStatus);
  const completedTodos = todos.filter(todo => todo.completed);
  const uncompletedTodos = todos.filter(todo => !todo.completed);
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const todosCount = todos.length;

  const loadTodos = async () => {
    try {
      const responseTodos = await todosApi.getTodos();

      setTodos(responseTodos);
    } catch {
      setError(ErrorsEnum.LoadTodos);
    }
  };

  const addTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError(ErrorsEnum.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      title: trimmedQuery,
      userId: USER_ID,
      completed: false,
    } as Todo);

    try {
      setIsLoading(true);
      const responseTodo = await todosApi.createTodo({
        userId: USER_ID,
        title: trimmedQuery,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, responseTodo]);
      setQuery('');
    } catch {
      setQuery(query);
      setError(ErrorsEnum.AddTodo);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId: number): Promise<boolean> => {
    setLoadingIds(prev => [...prev, todoId]);

    try {
      await todosApi.removeTodo(todoId);

      setTodos(prevTodos => {
        return prevTodos.filter(todo => todo.id !== todoId);
      });

      todoFieldRef.current?.focus();

      return true;
    } catch {
      setError(ErrorsEnum.DeleteTodo);

      return false;
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const clearCompletedTodos = async () => {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  };

  const updateTodo = async (todoToUpdate: Todo): Promise<boolean> => {
    setLoadingIds(prev => [...prev, todoToUpdate.id]);

    try {
      const updatedTodo = await todosApi.updateTodo(todoToUpdate);

      setTodos(prevTodos => {
        return prevTodos.map(todo =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        );
      });

      todoFieldRef.current?.focus();

      return true;
    } catch {
      setError(ErrorsEnum.UpdateTodo);

      return false;
    } finally {
      setLoadingIds(prev => {
        return prev.filter(todoId => todoId !== todoToUpdate.id);
      });
    }
  };

  const toggleAllTodos = () => {
    if (uncompletedTodos.length > 0) {
      uncompletedTodos.forEach(todo => {
        updateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        updateTodo({ ...todo, completed: false });
      });
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoFieldRef={todoFieldRef}
          todos={todos}
          query={query}
          onQueryChange={setQuery}
          addTodo={addTodo}
          toggleAllTodos={toggleAllTodos}
          isLoading={isLoading}
          isTodosExist={!!todos.length}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          loadingIds={loadingIds}
          isLoading={isLoading}
        />

        {todosCount > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            completedTodos={completedTodos}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <Notification error={error} onSetError={setError} />
    </div>
  );
};

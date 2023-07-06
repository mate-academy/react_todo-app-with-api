/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import {
  addTodo,
  toggleTodo,
  getTodos,
  removeTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/Filters';
import { filterTodos } from './helpers/filterTodos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';

const USER_ID = 10858;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>(TodoFilter.All);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [activeTodoIds, setActiveTodoIds] = useState<number[]>([]);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (error) {
      timerId = setTimeout(() => setError(null), 3000);
    }

    return () => clearTimeout(timerId);
  }, [error]);

  const visibleTodos = useMemo(() => (
    filterTodos(todos, filter)
  ), [todos, filter]);

  const hasCompletedTodo = useMemo(() => (
    todos.some(todo => todo.completed)
  ), [todos]);

  const activeTodosCount = useMemo(() => (
    todos
      .filter(todo => !todo.completed).length
  ), [todos]);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const handleFilterChange = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  const handleTodoAdd = useCallback((title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });
    setIsFormDisabled(true);

    addTodo(title)
      .then(newTodo => {
        setTempTodo(null);
        setIsFormDisabled(false);
        setTodos(prevTodos => [...prevTodos, newTodo]);

        return newTodo;
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTempTodo(null);
        setIsFormDisabled(false);
      });
  }, []);

  const deleteTodo = useCallback((todoId: number) => {
    setActiveTodoIds(prev => [...prev, todoId]);

    removeTodo(todoId)
      .then(response => {
        const isDeleted = Boolean(response);

        if (isDeleted) {
          setTodos(prevTodos => (
            prevTodos.filter(todo => todo.id !== todoId)
          ));

          setActiveTodoIds([]);
        }

        return isDeleted;
      })
      .catch(() => {
        setError('Unable to delete a todo');
        setActiveTodoIds([]);
      });
  }, []);

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => deleteTodo(todo.id));
  }, [todos]);

  const toggleCompletedStatus = useCallback(async (toggledTodo: Todo) => {
    setActiveTodoIds(prev => [...prev, toggledTodo.id]);

    try {
      const updatedTodo = await toggleTodo(toggledTodo);

      setTodos(prevTodos => (
        prevTodos.map(todo => {
          if (todo.id === toggledTodo.id) {
            return updatedTodo;
          }

          return todo;
        })
      ));

      setActiveTodoIds([]);
    } catch {
      setError('Unable to update a todo');
      setActiveTodoIds([]);
    }
  }, [todos]);

  const handleToggleAllStatuses = useCallback(() => {
    if (isAllTodosCompleted) {
      todos.forEach(todo => {
        toggleCompletedStatus(todo);
      });

      return;
    }

    todos.filter(todo => !todo.completed).forEach(todo => {
      toggleCompletedStatus(todo);
    });
  }, [todos]);

  const handleTodoEdit = useCallback((editedTodo: Todo) => {
    setTodos(prevTodos => (
      prevTodos.map(todo => {
        if (todo.id === editedTodo.id) {
          return editedTodo;
        }

        return todo;
      })
    ));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isFormDisabled={isFormDisabled}
          onTodoAdd={handleTodoAdd}
          setError={setError}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleClick={handleToggleAllStatuses}
        />

        <section className="todoapp__main">
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onTodoDelete={deleteTodo}
            activeTodoIds={activeTodoIds}
            onStatusChange={toggleCompletedStatus}
            setError={setError}
            onTodoEdit={handleTodoEdit}
          />
        </section>

        {todos.length > 0 && (
          <Footer
            isAnyCompleted={hasCompletedTodo}
            activeTodosCount={activeTodosCount}
            onFilterChange={handleFilterChange}
            selectedFilter={filter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        setError={setError}
      />

    </div>
  );
};

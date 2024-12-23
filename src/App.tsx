/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorType } from './types/ErrorType';
import { TodoList } from './components/TodoList';
import { filterTodos } from './utils/filterTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.Default,
  );
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const notCompletedTodosCount = todos.filter(todo => !todo.completed).length;
  const allTodosAreCompleted = useMemo(
    () => todos.every(todo => todo.completed),
    [todos],
  );

  const inputNameRef = useRef<HTMLInputElement>(null);

  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorType.DeleteTodo);
      inputNameRef.current?.focus();
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    setTempTodo({
      id: 0,
      title: todoTitle,
      completed: false,
      userId: USER_ID,
    });
    try {
      const newTodo = await createTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorType.AddTodo);
      inputNameRef.current?.focus();
      throw error;
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (err) {
      setErrorMessage(ErrorType.UpdateTodo);
      inputNameRef.current?.focus();
      throw err;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }
  }, []);

  const handleToggleAll = useCallback(async () => {
    if (notCompletedTodosCount > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo =>
        handleUpdateTodo({ ...todo, completed: true }),
      );
    } else {
      todos.forEach(todo => handleUpdateTodo({ ...todo, completed: false }));
    }
  }, [notCompletedTodosCount, todos, handleUpdateTodo]);

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(completedTodos.map(todo => handleDeleteTodo(todo.id)));
    } catch {}
  }, [todos, handleDeleteTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.LoadTodo);
      });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          onToggleAll={handleToggleAll}
          todosLength={todos.length}
          inputNameRef={inputNameRef}
          isInputDisabled={!!tempTodo}
          allTodosAreCompleted={allTodosAreCompleted}
        />

        {!!todos.length && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              handleDeleteTodo={handleDeleteTodo}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              handleUpdateTodo={handleUpdateTodo}
            />

            <Footer
              todos={todos}
              notCompletedTodosCount={notCompletedTodosCount}
              filter={filter}
              handleFilterChange={handleFilterChange}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

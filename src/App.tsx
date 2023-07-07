/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo, UpdateTodoArgs } from './types/Todo';
import { FilteringOption } from './types/Filter';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Notifications } from './components/Notifications';
import { Footer } from './components/Footer/Footer';

const USER_ID = 10921;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilteringOption>(FilteringOption.all);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError('Unable to get todos'));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 3000);
  }, [error]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const areAllCompleted = todos.every(todo => todo.completed);

  const handleCloseError = () => {
    setError(null);
  };

  const handleAddTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      const tempId = 0;

      setTempTodo({
        id: tempId,
        ...newTodo,
      });

      setLoadingTodoIds([tempId]);
      const addedTodo = await addTodo(newTodo);

      setTodos(curTodos => [...curTodos, addedTodo]);
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodoIds([]);
    }
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setLoadingTodoIds(prevLoadingTodoIds => [...prevLoadingTodoIds, todoId]);
      await deleteTodo(todoId);
      setTodos(prevTodoIds => prevTodoIds
        .filter(prevTodoId => prevTodoId.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setTempTodo(null);
      setLoadingTodoIds([]);
    }
  };

  const handleClearCompletedTodos = async () => {
    const deletedTodos = completedTodos.map(todo => handleDeleteTodo(todo.id));

    try {
      await Promise.all(deletedTodos);
    } catch {
      setError('Unable to clear completed todos');
    }
  };

  const handleUpdateTodo = useCallback(
    async (
      todoId: number,
      newTodoData: UpdateTodoArgs,
    ) => {
      try {
        setLoadingTodoIds(prevIds => [...prevIds, todoId]);
        const updatedTodo = await updateTodo(todoId, newTodoData);

        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id !== todoId) {
            return todo;
          }

          return updatedTodo;
        }));
      } catch {
        setError('Unable to update a todo');
      } finally {
        setLoadingTodoIds([]);
      }
    },
    [todos],
  );

  const toggleAllCompletedTodos = async () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);

    try {
      await Promise.all(
        updatedTodos.map(todo => (
          handleUpdateTodo(todo.id, { completed: !areAllCompleted }))),
      );
    } catch {
      setError('Unable to update todos');
    }
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilteringOption.active:
        return activeTodos;

      case FilteringOption.completed:
        return completedTodos;

      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setError={setError}
          onAdd={handleAddTodo}
          tempTodo={tempTodo}
          toggleAllCompletedTodos={toggleAllCompletedTodos}
          areAllCompleted={areAllCompleted}
        />
        <TodoList
          todos={visibleTodos}
          onDelete={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          handleUpdateTodo={handleUpdateTodo}
        />

        <Footer
          todos={visibleTodos}
          filter={filter}
          setFilter={setFilter}
          activeTodos={activeTodos}
          completedTodos={completedTodos}
          handleClearCompletedTodos={handleClearCompletedTodos}
        />
      </div>
      <Notifications
        error={error}
        handleCloseError={handleCloseError}
      />
    </div>
  );
};

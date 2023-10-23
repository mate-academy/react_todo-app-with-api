/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import {
  getTodos,
  createTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { Filters } from './types/filters';

const USER_ID = 10953;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);
  const [filter, setFilter] = useState(Filters.ALL);
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErr('Error: cannot upload todos'));
  }, []);

  useEffect(() => {
    let errorTimer: number;

    if (err) {
      errorTimer = window.setTimeout(() => {
        setErr(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [err]);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filters.COMPLETED:
        return completedTodos;

      case Filters.ACTIVE:
        return activeTodos;

      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodo = useCallback(async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setErr('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  }, [todos]);

  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErr('Unable to delete a todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, [loadingTodos]);

  const handleDeleteCompletedButton = async () => {
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
    } catch {
      setErr('Unable to delete todos');
    }
  };

  const handleToggleComplete = async (todoId: number) => {
    setLoadingTodos([todoId]);

    try {
      const todoToUpdate = todos.find((todo) => todo.id === todoId);

      if (todoToUpdate) {
        const updatedTodo = await updateTodo(todoId,
          { completed: !todoToUpdate.completed });
        const updatedTodos = todos.map((todo) => {
          if (todo.id === todoId) {
            return updatedTodo;
          }

          return todo;
        });

        setTodos(updatedTodos);
      }
    } catch (error) {
      setErr('Error updating todo:');
    } finally {
      setLoadingTodos([]);
    }
  };

  const toggleAllTodos = async () => {
    const areAllTodosCompleted = todos.every((todo) => todo.completed);
    const updatedCompletedStatus = !areAllTodosCompleted;

    const todosToUpdate = todos.filter(
      (todo) => todo.completed !== updatedCompletedStatus,
    );
    const todoIdsToUpdate = todosToUpdate.map((todo) => todo.id);

    setLoadingTodos(todoIdsToUpdate);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(
          (todo) => updateTodo(todo.id, { completed: updatedCompletedStatus }),
        ),
      );

      const allUpdatedTodos = todos.map((todo) => {
        const updatedTodo = updatedTodos.find(
          (updated) => updated.id === todo.id,
        );

        return updatedTodo || todo;
      });

      setTodos(allUpdatedTodos);
    } catch (error) {
      setErr('Error: cannot update todos');
    } finally {
      setLoadingTodos([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErr={setErr}
          addTodo={addTodo}
          tempTodo={tempTodo}
          toggleAllTodos={toggleAllTodos}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
          onCompleteTodo={handleToggleComplete}
        />

        {visibleTodos.length > 0 && (
          <TodoFilter
            todos={visibleTodos}
            filter={filter}
            onChangeFilter={setFilter}
            handleDeleteCompletedButton={handleDeleteCompletedButton}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        err={err}
        setErr={setErr}
      />
    </div>
  );
};

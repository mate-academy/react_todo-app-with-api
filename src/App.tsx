/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

import { todosApi } from './api/todos';
import { filterTodosByCompleted } from './helpers/helpers';
import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { ErrorTypes } from './types/ErrorTypes';

import { AuthContext } from './components/Auth/AuthContext';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { useError } from './controllers/useError';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedFilter, setCompletedFilter] = useState(FilterTypes.ALL);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const [errorMessage, showError, closeError] = useError();

  useEffect(() => {
    if (user) {
      todosApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => showError(ErrorTypes.OnLoad));
    }
  }, [user]);

  const addTodo = useCallback(async (fieldsToCreate: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);
    setTempTodo({ ...fieldsToCreate, id: 0 });

    try {
      const newTodo = await todosApi.addTodo(fieldsToCreate);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch {
      showError(ErrorTypes.OnAdd);

      throw Error(ErrorTypes.OnAdd);
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, []);

  const deleteTodo = useCallback(async (todoId: number) => {
    setDeletingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      await todosApi.deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorTypes.OnDelete);
    } finally {
      setDeletingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const updateTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>,
  ) => {
    setUpdatingTodoIds(prevIds => [...prevIds, todoId]);

    try {
      const updatedTodo = await todosApi.updateTodo(todoId, fieldsToUpdate);

      setTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id === todoId) {
          return updatedTodo;
        }

        return todo;
      }));
    } catch {
      showError(ErrorTypes.OnUpdate);
    } finally {
      setUpdatingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return filterTodosByCompleted(todos, completedFilter);
  }, [todos, completedFilter]);

  const activeTodosAmount = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosAmount = useMemo(() => {
    return todos.filter(todo => todo.completed).length;
  }, [todos]);

  const isAllTodosCompleted = useMemo(() => {
    return todos.length === completedTodosAmount;
  }, [todos, completedTodosAmount]);

  const toggleAllTodosStatus = useCallback(() => {
    const wantedTodoStatus = !isAllTodosCompleted;

    Promise.all(todos.map(async (todo) => {
      if (todo.completed !== wantedTodoStatus) {
        await updateTodo(todo.id, { completed: wantedTodoStatus });
      }
    }));
  }, [isAllTodosCompleted, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          isAddingTodo={isAddingTodo}
          showError={showError}
          isAllTodosCompleted={isAllTodosCompleted}
          toggleAllTodosStatus={toggleAllTodosStatus}
        />

        {(todos.length || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
              deletingTodoIds={deletingTodoIds}
              updatingTodoIds={updatingTodoIds}
            />

            <Footer
              completedFilter={completedFilter}
              setCompletedFilter={setCompletedFilter}
              clearCompletedTodos={clearCompletedTodos}
              activeTodosAmount={activeTodosAmount}
              completedTodosAmount={completedTodosAmount}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorMessage
          errorMessage={errorMessage}
          closeError={closeError}
        />
      )}
    </div>
  );
};

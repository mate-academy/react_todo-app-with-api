/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { AuthContext } from './components/Auth/AuthContext';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { FilterType } from './types/FilterType';
import { filteredTodosHelper } from './helpers/FilteredTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedFilter, setCompletedFilter] = useState(FilterType.All);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      getTodos(user?.id)
        .then(setTodos)
        .catch(() => {
          setHasError(true);
          setErrorMessage('Can\'t load todos');
        });
    }
  });

  const filteredTodos = useMemo(() => (
    filteredTodosHelper(todos, completedFilter)
  ), [todos, completedFilter]);

  const countOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  if (hasError) {
    setTimeout(() => setHasError(false), 3000);
  }

  const closeMessage = useCallback(() => {
    setHasError(false);
  }, [hasError]);

  const addNewTodo = useCallback(async (newTitle: string) => {
    setIsAdding(true);

    if (user) {
      try {
        const newTodo = await createTodo({
          title: newTitle.trim(),
          userId: user?.id,
          completed: false,
        });

        setTodos(currentTodos => [
          ...currentTodos, newTodo,
        ]);
        setErrorMessage('');
        setHasError(false);
      } catch (error) {
        setErrorMessage('Unable to add a todo');
        setHasError(true);
      } finally {
        setIsAdding(false);
      }
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(
        todo => todo.id !== todoId,
      ));
      setErrorMessage('');
      setHasError(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
      setHasError(true);
    }
  }, []);

  const clearCompleted = useCallback(() => {
    return todos.forEach(todo => {
      if (todo.completed) {
        removeTodo(todo.id);
      }
    });
  }, [todos, removeTodo]);

  const changeTodo = useCallback(async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    try {
      setErrorMessage('');
      await updateTodo(todoId, fieldsToUpdate);

      setTodos(currentTodos => currentTodos.map(todo => (
        todo.id === todoId
          ? { ...todo, ...fieldsToUpdate }
          : todo
      )));
      setErrorMessage('');
      setHasError(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setHasError(true);
    }
  }, []);

  const isAllTodosCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAllTodos = async (
    todoId: number,
    fieldsToUpdate: Partial<Todo>,
  ) => {
    setIsUpdating(true);
    await changeTodo(todoId, fieldsToUpdate);
    setIsUpdating(false);
  };

  const changeAllTodos = useCallback(() => {
    todos.forEach(todo => {
      const isTodoNeedToUpdate = !isAllTodosCompleted && !todo.completed;

      if (isTodoNeedToUpdate || isAllTodosCompleted) {
        toggleAllTodos(todo.id, { completed: !todo.completed });
      }
    });
  }, [todos, isAllTodosCompleted]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          setErrorMessage={setErrorMessage}
          setHasError={setHasError}
          isAdding={isAdding}
          onAddNewTodo={addNewTodo}
          changeAllTodos={changeAllTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              onRemoveTodo={removeTodo}
              setErrorMessage={setErrorMessage}
              changeTodo={changeTodo}
              newTodoField={newTodoField}
              isUpdating={isUpdating}
            />
            <Footer
              activeTodos={countOfActiveTodos}
              hasCompletedTodos={hasCompletedTodos}
              filterType={completedFilter}
              setFilterType={setCompletedFilter}
              onClearCompleted={clearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        hasError={hasError}
        setHasError={closeMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
};

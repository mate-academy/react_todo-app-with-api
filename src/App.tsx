/* eslint-disable */
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Todo } from './types/Todo';
import {getTodos, addTodo, deleteTodo, updateTodo,} from './api/todos';
import { ErrorTypes } from './types/ErrorTypes';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList';
import { USER_ID } from './constatnts/ApiConstants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>(ErrorTypes.Empty);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(FilterStatus.All,);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const inputAddRef = useRef<HTMLInputElement>(null);

  const filteredTodos = useMemo(
    () =>
      todos.filter(todo => {
        if (filterStatus === FilterStatus.All) {
          return true;
        }

        return filterStatus === FilterStatus.Completed
          ? todo.completed
          : !todo.completed;
      }),
    [todos, filterStatus],
  );

  const todosLeftNum = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const todosCompletedNum = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const areAllTodosCompleted = useMemo(
    () => todos.length === todosCompletedNum,
    [todos],
  );

  const handleAddTodo = useCallback(async (todoTitle: string) => {
    setTempTodo({ id: 0, title: todoTitle, completed: false, userId: USER_ID });
    try {
      const newTodo = await addTodo({ title: todoTitle, completed: false });

      setTodos(prev => [...prev, newTodo]);
    } catch (error) {
      setErrorMessage(ErrorTypes.AddTodo);
      inputAddRef?.current?.focus();
      throw error;
    } finally {
      setTempTodo(null);
    }
  }, [USER_ID]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage(ErrorTypes.DeleteTodo);
      inputAddRef?.current?.focus();
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }, [setTodos, setLoadingTodoIds, setErrorMessage]);

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  }, [handleDeleteTodo, todos]);

  const handleUpdateTodo = useCallback(async (todoToUpdate: Todo) => {
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);
    try {
      const updatedTodo = await updateTodo(todoToUpdate);

      setTodos(prev =>
        prev.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
      );
    } catch (error) {
      setErrorMessage(ErrorTypes.UpdateTodo);
      throw error;
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
    }

    return;
  }, [setTodos, setLoadingTodoIds, setErrorMessage]);

  const handleToggleAll = useCallback(async () => {
    if (todosLeftNum > 0) {
      const activeTodos = todos.filter(todo => !todo.completed);

      activeTodos.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: true });
      });
    } else {
      todos.forEach(todo => {
        handleUpdateTodo({ ...todo, completed: false });
      });
    }
  }, [handleUpdateTodo, todos, todosLeftNum]);

  useEffect(() => {
    const getAllTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (error) {
        setErrorMessage(ErrorTypes.Loading);
      }
    };

    getAllTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          setErrorMessage={setErrorMessage}
          isInputDisabled={!!tempTodo}
          onToggleAll={handleToggleAll}
          areAllTodosCompleted={areAllTodosCompleted}
          TODOS_LENGTH_VALUE={todos.length}
          inputRef={inputAddRef}
        />

        {(!!todos.length || tempTodo) && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              onDeleteTodo={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
              loadingTodoIds={loadingTodoIds}
              tempTodo={tempTodo}
            />

            <Footer
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              todosLeft={todosLeftNum}
              todosCompleted={todosCompletedNum}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        data-cy="ErrorNotification"
        error={errorMessage}
        setError={setErrorMessage}
      />
    </div>
  );
};

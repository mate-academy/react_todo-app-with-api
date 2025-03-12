/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodos,
  getTodos,
  updateTodos,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/Error';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newTodo, setNewTodo] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newFilter, setNewFilter] = useState<Filter>(Filter.All);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [todoClear, setTodoClear] = useState<boolean>(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectTodoId, setSelectTodoId] = useState<number | null>(null);
  const [areActiveTodos, setAreActiveTodos] = useState<boolean>(false);
  const [loaderUptadeTodo, setLoaderUpdateTodo] = useState<number | null>(null);
  const [selectTodoIds, setSelectTodoIds] = useState<number[]>([]);
  const hasActiveTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    setAreActiveTodos(hasActiveTodos);
  }, [todos, hasActiveTodos]);

  const loadTodos = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const todosData = await getTodos();
      const completedTodos = todosData.filter(todo => todo.completed);

      setTodos(todosData);
      setTodoClear(completedTodos.length > 0);
    } catch (error) {
      setErrorMessage('Unable to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    setTodoClear(hasActiveTodos);
  }, [hasActiveTodos]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const deleteTodo = async (todoId: number) => {
    setIsLoading(true);
    setSelectTodoId(todoId);

    try {
      await deleteTodos(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setSelectTodoId(null);
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setSelectTodoIds(completedTodos.map(todo => todo.id));

    try {
      const failedTodos: Todo[] = [];

      for (const todo of completedTodos) {
        try {
          await deleteTodos(todo.id);
        } catch (error) {
          setErrorMessage('Unable to delete a todo');
          failedTodos.push(todo);
        }
      }

      setTodos(currentTodos =>
        currentTodos.filter(
          todo => !todo.completed || failedTodos.includes(todo),
        ),
      );

      if (failedTodos.length > 0) {
        setTodos(prevTodos => [...prevTodos, ...failedTodos]);
      }

      setTodoClear(false);
    } catch (error) {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsInputDisabled(false);
      setSelectTodoIds([]);
    }
  };

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsLoading(true);
    setIsInputDisabled(true);

    const tempNewTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodo.trim(),
      completed: false,
    };

    setTempTodo(tempNewTodo);

    try {
      const addedTodo = await addTodos(tempNewTodo);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setNewTodo('');
    } catch (error) {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      setIsInputDisabled(false);
    }
  };

  const updateTodo = async (updatedTodo: Todo) => {
    setIsLoading(true);
    setIsInputDisabled(true);
    setLoaderUpdateTodo(updatedTodo.id);

    try {
      // Оновлюємо задачу на сервері
      await updateTodos(updatedTodo);

      // Оновлюємо задачу в стані
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: updatedTodo.completed }
            : todo,
        ),
      );
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setIsInputDisabled(false);
      setLoaderUpdateTodo(null);
    }
  };

  const onToggleAll = async () => {
    const areAllCompleted = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== areAllCompleted,
    );

    setSelectTodoIds(todosToUpdate.map(todo => todo.id));

    try {
      const failedTodos: Todo[] = [];
      const updatePromises = todosToUpdate.map(async todo => {
        try {
          await updateTodo({ ...todo, completed: areAllCompleted });
        } catch (error) {
          setErrorMessage('Unable to update a todo');
          failedTodos.push(todo);
        }
      });

      await Promise.all(updatePromises);
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todosToUpdate.includes(todo)) {
            return { ...todo, completed: areAllCompleted };
          }

          return todo;
        }),
      );

      if (failedTodos.length > 0) {
        setTodos(prevTodos => [...prevTodos, ...failedTodos]);
      }
    } catch (error) {
      setErrorMessage('Unable to update all todos');
    } finally {
      setSelectTodoIds([]);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (newFilter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <Header
        isInputDisabled={isInputDisabled}
        areActiveTodos={areActiveTodos}
        handleSubmit={onAdd}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
        todos={todos}
        onToggleAll={onToggleAll}
      />

      {todos.length > 0 && (
        <TodoList
          filteredTodos={filteredTodos}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          isLoading={isLoading}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          selectTodoId={selectTodoId}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          updateTodo={updateTodo}
          loaderUptadeTodo={loaderUptadeTodo}
          selectTodoIds={selectTodoIds}
        />
      )}

      {todos.length > 0 && (
        <Footer
          todoClear={todoClear}
          todos={todos}
          newFilter={newFilter}
          setNewFilter={setNewFilter}
          clearCompletedTodos={clearCompletedTodos}
        />
      )}
      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

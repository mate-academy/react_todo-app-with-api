/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as todoService from './api/todos';
import { UserWarning } from './components/UserWarning';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoNotification } from './components/TodoNotification';
import { Todo } from './types/Todo';
import { TodoFilter } from './types/TodoFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterField, setFilterField] = useState<TodoFilter>(TodoFilter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const completedTodos = useMemo(
    () => [...todos].filter(todo => todo.completed),
    [todos],
  );

  const uncompletedTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const areAllTodosCompleted = useCallback(() => {
    return completedTodos.length === todos.length;
  }, [completedTodos, todos]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const loadTodos = () => {
    setErrorMessage('');
    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = ({ title, completed, userId }: Todo) => {
    setErrorMessage('');
    setLoading(true);

    const newTodo = {
      id: Math.random(),
      title: title.trim(),
      userId: todoService.USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);

    return todoService
      .createTodo({ title, completed, userId })
      .then(newOneTodo => {
        setTodos(currentTodos => [...currentTodos, newOneTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setLoading(false);

        setTempTodo(null);
      });
  };

  const updateTodo = async (updatedTodo: Todo): Promise<boolean> => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === updatedTodo.id ? { ...updatedTodo, isEditing: true } : todo,
      ),
    );
    try {
      const changedTodo = await todoService.updateTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === changedTodo.id ? changedTodo : todo,
        ),
      );

      return true;
    } catch (error) {
      setTodos(todos);
      setErrorMessage('Unable to update a todo');
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.isEditing ? { ...todo, isEditing: false } : todo,
        ),
      );

      return false;
    } finally {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.isEditing ? { ...todo, isEditing: false } : todo,
        ),
      );
    }
  };

  const deleteTodo = async (todoId: number) => {
    setErrorMessage('');
    setLoading(true);
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    try {
      await todoService.deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === todoId ? { ...todo, isDeleting: false } : todo,
        ),
      );
      setErrorMessage('Unable to delete a todo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletedStatus = () => {
    if (areAllTodosCompleted()) {
      todos.map(todo => updateTodo({ ...todo, completed: false }));
    } else {
      uncompletedTodos.map(todo => updateTodo({ ...todo, completed: true }));
    }
  };

  const clearCompletedTodos = async () => {
    setLoading(true);
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.completed ? { ...todo, isDeleting: true } : todo,
      ),
    );

    if (completedTodos.length === 0) {
      return;
    }

    try {
      const results = await Promise.allSettled(
        completedTodos.map(todo => todoService.deleteTodo(todo.id)),
      );

      const successfullyDeletedIds = completedTodos
        .map((todo, index) =>
          results[index].status === 'fulfilled' ? todo.id : null,
        )
        .filter((id): id is number => id !== null);

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );
      if (results.some(result => result.status === 'rejected')) {
        setErrorMessage('Unable to delete a todo');
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.completed ? { ...todo, isDeleting: false } : todo,
          ),
        );
      } else {
        setErrorMessage('');
      }
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  };

  const filterTodos = useMemo(() => {
    switch (filterField) {
      case TodoFilter.Active:
        return uncompletedTodos;
      case TodoFilter.Completed:
        return completedTodos;
      default:
        return todos;
    }
  }, [filterField, uncompletedTodos, completedTodos, todos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          areAllTodosCompleted={areAllTodosCompleted}
          onSubmit={addTodo}
          validation={setErrorMessage}
          isLoading={loading}
          toggleCompletedStatus={toggleCompletedStatus}
          isTodosEmpty={todos.length === 0}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filterTodos}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            isLoading={loading}
            onUpdate={updateTodo}
          />
        )}

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            filterField={filterField}
            onChangeFilter={setFilterField}
            clearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <TodoNotification errorText={errorMessage} />

      {/* {loading && <Loader />} */}
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { client } from './utils/fetchClient';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);
  const [isEditingTodo, setIsEditingTodo] = useState(false);

  const errorTimeout = useRef<number | null>(null);

  function hideErrorButton() {
    setError(null);
  }

  function handleNewFilterMode(mode: Filter) {
    setFilter(mode);
  }

  function showError(message: string) {
    if (errorTimeout.current !== null) {
      clearTimeout(errorTimeout.current);
    }

    setError(message);
    errorTimeout.current = window.setTimeout(() => setError(null), 3000);
  }

  const deleteTodo = async (id: number) => {
    setProcessingTodoIds(prev => [...prev, id]);

    try {
      await client.delete(`/todos/${id}`);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (e) {
      showError('Unable to delete a todo');
      setProcessingTodoIds(prev => prev.filter(todoId => todoId !== id));
      throw e;
    }
  };

  async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
  }

  function handleNewTitle(title: string): Promise<boolean> {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setIsLoading(true);
    setTempTodo(newTodo);

    return client
      .post<Todo>(`/todos`, newTodo)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setTempTodo(null);

        return true;
      })
      .catch(() => {
        showError('Unable to add a todo');
        setTempTodo(null);

        return false;
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const activeTodos = todos?.filter(todo => !todo.completed).length;

  async function updateTodoData(todoId: number, data: Partial<Todo>) {
    setProcessingTodoIds(prev => [...prev, todoId]);

    try {
      const updatedTodo = await client.patch<Todo>(`/todos/${todoId}`, data);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      showError('Unable to update a todo');
      throw new Error('Update failed');
    } finally {
      setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  }

  async function handleMarkAllCompleted() {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    await Promise.all(
      todosToUpdate.map((todo: Todo) =>
        updateTodoData(todo.id, { completed: newStatus }),
      ),
    );
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

        setTodos(response);
      } catch {
        showError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          handleEmptyTitle={showError}
          handleNewTitle={handleNewTitle}
          isLoading={isLoading}
          handleMarkAllCompleted={handleMarkAllCompleted}
          isEditingTodo={isEditingTodo}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={todos ?? []}
              filter={filter}
              tempTodo={tempTodo}
              deleteTodo={deleteTodo}
              processingTodoIds={processingTodoIds}
              updateTodoData={updateTodoData}
              setIsEditingTodo={setIsEditingTodo}
            />

            <Footer
              activeTodos={activeTodos ?? 0}
              filter={filter}
              handleNewFilterMode={handleNewFilterMode}
              todos={todos}
              handleClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification hideErrorButton={hideErrorButton} error={error} />
    </div>
  );
};

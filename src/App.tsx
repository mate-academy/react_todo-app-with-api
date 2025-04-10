/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      setError(null);
      setIsLoading(true);
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch {
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const updateTodoItem = async (
    todoId: number,
    updatedFields: Partial<Todo>,
  ) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isLoading: true } : todo,
      ),
    );

    try {
      const updatedTodo = await updateTodo(todoId, updatedFields);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (err) {
      setError('Unable to update a todo');
      throw err;
    } finally {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, isLoading: false } : todo,
        ),
      );
    }
  };

  const toggleTodo = async (todoId: number) => {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    await updateTodoItem(todoId, { completed: !todo.completed });
  };

  const toggleAll = async () => {
    const newStatus = !todos.every(todo => todo.completed);

    setIsLoading(true);

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          updateTodoItem(todo.id, { completed: newStatus }),
        ),
      );
    } catch {
      setError('Unable to toggle all todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (
    event: React.FormEvent,
    focusInput: () => void,
  ) => {
    event.preventDefault();
    const title = newTodoTitle.trim();

    if (!title) {
      setError('Title should not be empty');
      focusInput();

      return;
    }

    const newTempTodo: Todo = {
      id: 0, // тимчасовий id
      userId: USER_ID,
      title,
      completed: false,
      isLoading: true,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, isDeleting: true } : todo,
      ),
    );

    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    }
  };

  const clearCompletedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const failedIds = completedTodos
      .filter((_, index) => results[index].status === 'rejected')
      .map(todo => todo.id);

    if (failedIds.length > 0) {
      setError('Unable to delete a todo');
    }

    setTodos(prevTodos =>
      prevTodos.filter(
        todo =>
          !completedTodos.some(
            ct => ct.id === todo.id && failedIds.indexOf(ct.id) === -1,
          ),
      ),
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.Active) {
      return !todo.completed;
    }

    if (filter === FilterType.Completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      {!USER_ID ? (
        <UserWarning />
      ) : (
        <>
          <h1 className="todoapp__title">todos</h1>
          <div className="todoapp__content">
            <Header
              newTodoTitle={newTodoTitle}
              setNewTodoTitle={setNewTodoTitle}
              handleAddTodo={handleAddTodo}
              isLoading={!!tempTodo}
              todos={todos}
              inputRef={inputRef}
              toggleAll={toggleAll}
            />
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              isLoading={isLoading}
              handleDeleteTodo={handleDeleteTodo}
              onToggle={toggleTodo}
              onUpdate={updateTodoItem}
            />
            {todos.length > 0 && (
              <Footer
                todos={todos}
                filter={filter}
                setFilter={setFilter}
                handleClearCompleted={clearCompletedTodos}
              />
            )}
          </div>
          <ErrorNotification error={error} setError={setError} />
        </>
      )}
    </div>
  );
};

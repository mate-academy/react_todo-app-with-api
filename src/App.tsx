import React, { useEffect, useState, useRef } from 'react';
import { getTodos, addTodo, deleteTodo, patchTodo } from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { Todo } from './types/Todo';
import { FilterType } from './types/enum';
import { TodoFooter } from './components/TodoFooter';
import classNames from 'classnames';
import './styles/index.scss';
import './styles/todoapp.scss';
import './styles/filter.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>('');
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = newTodo.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    const tempId = Date.now();
    const newTempTodo = {
      id: tempId,
      userId: 1,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);

    try {
      const savedTodo = await addTodo({
        title: trimmedTitle,
        completed: false,
      });

      setTodos(prevTodos => [...prevTodos, savedTodo]);
      setNewTodo('');
      setTempTodo(null);
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
    } finally {
      setTimeout(() => inputRef.current?.focus(), 0);
      setIsLoading(false);
    }
  };

  const handlePatch = async (id: number, newTitle: string): Promise<Todo> => {
    try {
      setLoadingTodos(prev => [...prev, id]);
      const updatedTodo = await patchTodo(id, { title: newTitle });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, title: updatedTodo.title } : todo,
        ),
      );

      return updatedTodo;
    } catch (e) {
      if (!isLoading) {
        setError('Unable to update a todo');
      }

      throw new Error('Update failed');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingTodos(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
      inputRef.current?.focus();
    }
  };

  const handleToggle = async (id: number) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const newStatus = !todoToUpdate.completed;

    setLoadingTodos(prev => [...prev, id]);

    try {
      await patchTodo(id, { completed: newStatus });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, completed: newStatus } : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingTodos(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    setLoadingTodos(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    try {
      await Promise.all(
        todosToUpdate.map(todo => patchTodo(todo.id, { completed: newStatus })),
      );

      setTodos(
        todos.map(todo =>
          todosToUpdate.includes(todo)
            ? { ...todo, completed: newStatus }
            : todo,
        ),
      );
    } catch {
      setError('Unable to toggle all todos');
    } finally {
      setLoadingTodos(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodos(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );
    const successfulDeletes = completedTodos.filter(
      (_, i) => results[i].status === 'fulfilled',
    );

    setTodos(prev => prev.filter(todo => !successfulDeletes.includes(todo)));

    if (results.some(result => result.status === 'rejected')) {
      setError('Unable to delete a todo');
    }

    setLoadingTodos(prev =>
      prev.filter(id => !completedTodos.some(todo => todo.id === id)),
    );
  };

  useEffect(() => {
    const loadTodos = async () => {
      setError('');
      setIsLoading(true);
      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        inputRef.current?.focus();
        setError('Unable to load todos');
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    loadTodos();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleAdd={handleAdd}
          isLoading={isLoading}
          inputRef={inputRef}
          todos={todos}
          handleToggle={handleToggleAll}
        />

        <TodoList
          filteredTodos={filteredTodos}
          isLoading={isLoading}
          handleToggle={handleToggle}
          handleDelete={handleDelete}
          loadingTodos={loadingTodos}
          tempTodo={tempTodo}
          handlePatch={handlePatch}
        />

        <TodoFooter
          setFilter={setFilter}
          filter={filter}
          handleClearCompleted={handleClearCompleted}
          todos={todos}
        />
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { useState } from 'react';
import { Todo } from './types/Todo';
import { Footer } from './components/Footer';
import { Notifications } from './components/Notifications';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

export enum TodoStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.ALL);
  const [filtered, setFiltered] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editTitleIds, setEditTitleIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
        setFiltered(fetchedTodos);
      } catch (er) {
        setError('Unable to load todos');
        setTimeout(() => setError(null), 3000);
      }
    };

    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      setTimeout(() => setError(null), 3000);

      return;
    }

    setIsSubmitting(true);
    const newTempTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoading(true);
    try {
      const newTodo = await addTodo({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
      setError(null);
    } catch (er) {
      setError('Unable to add a todo');
      setNewTodoTitle(trimmedTitle);
      setTimeout(() => setError(null), 3000);
    } finally {
      setTempTodo(null);
      setLoading(false);
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleUpdateTodo = async (data: Todo) => {
    setEditTitleIds(prevIds => [...prevIds, data.id]);
    try {
      await updateTodo(data.id, { title: data.title });

      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id == data.id ? { ...todo, title: data.title } : todo,
        ),
      );
    } catch (e) {
      setError('Unable to update a todo');
    } finally {
      setEditTitleIds(prevIds => prevIds.filter(id => id !== data.id));
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setDeletedIds(prevIds => [...prevIds, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (er) {
      setError('Unable to delete a todo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletedIds(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  const handleToggleTodo = async (todo: Todo) => {
    setUpdatingIds(prevIds => [...prevIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === todo.id ? updatedTodo : t)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setUpdatingIds(prevIds => prevIds.filter(id => id !== todo.id));
    }
  };

  const handleAllToggleTodo = async () => {
    const areAllCompleted = todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== !areAllCompleted,
    );

    const updatePromise = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: !areAllCompleted }),
    );

    const results = await Promise.allSettled(updatePromise);

    const successfulUpdates = results.filter(
      result => result.status === 'fulfilled',
    );

    if (successfulUpdates.length === results.length) {
      const updatedTodo = todos.map(todo => ({
        ...todo,
        completed: !areAllCompleted,
      }));

      setTodos(updatedTodo);
    } else {
      setError('Unable to update some todos');
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    const filteredTodos = todos.filter(todo => {
      if (filter === TodoStatus.ACTIVE) {
        return !todo.completed;
      }

      if (filter === TodoStatus.COMPLETED) {
        return todo.completed;
      }

      return filter === TodoStatus.ALL;
    });

    setFiltered(filteredTodos);
  }, [filter, todos]);

  const handleClearCompleted = async () => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedTodos.length === 0) {
      return;
    }

    const deletePromises = completedTodos.map(todoId => deleteTodo(todoId));

    const results = await Promise.allSettled(deletePromises);

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== completedTodos[index]),
        );
      } else {
        setError('Unable to delete a todo');
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          loading={loading}
          title={newTodoTitle}
          setTitle={setNewTodoTitle}
          todos={todos}
          onChange={handleAllToggleTodo}
          onAddTodo={handleAddTodo}
          isSubmitting={isSubmitting}
          error={error}
        />

        <TodoList
          loading={loading}
          todos={filtered}
          tempTodo={tempTodo}
          onDeleteTodo={handleDeleteTodo}
          onUpdateTodo={handleToggleTodo}
          onUpdateTitleTodo={handleUpdateTodo}
          isSubmitting={isSubmitting}
          deletedIds={deletedIds}
          updatingIds={updatingIds}
          editTitleIds={editTitleIds}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClick={handleClearCompleted}
          />
        )}
      </div>
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Notifications errorMessage={error} onClose={() => setError(null)} />
    </div>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.all);
  const [newTodo, setNewTodo] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodoId, setProcessingTodoId] = useState<number | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  const handleEditStart = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditCancel = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(event.target.value);
  };

  const handleEditSubmit = async (todo: Todo) => {
    const newTitle = editingTitle.trim();

    if (newTitle === todo.title) {
      handleEditCancel();

      return;
    }

    if (!newTitle) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        await handleDeleteTodo(todo.id);
        handleEditCancel();
      } catch {
        setError('Unable to delete a todo');

        return;
      }

      return;
    }

    setProcessingTodoId(todo.id);
    setIsLoading(true);

    try {
      const updated = await updateTodo(todo.id, { title: newTitle });

      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, title: updated.title } : t)),
      );
      setEditingTodoId(null);
      setEditingTitle('');
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setProcessingTodoId(null);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = newTodo.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    setIsLoading(true);

    const temp: Todo = {
      id: -Date.now(),
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [
        ...prev,
        ...(Array.isArray(created) ? created : [created]),
      ]);
      setNewTodo('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setIsLoading(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessingTodoId(todoId);
    setIsLoading(true);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setIsLoading(false);
      setProcessingTodoId(null);
    }
  };

  const handleToggleCompleted = async (todoId: number, completed: boolean) => {
    setProcessingTodoId(todoId);
    setIsLoading(true);
    try {
      const updated = await updateTodo(todoId, { completed });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, completed: updated.completed } : todo,
        ),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setIsLoading(false);
      setProcessingTodoId(null);
    }
  };

  const handleToggleAll = async () => {
    const shouldCompleteAll = !todos.every(todo => todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await Promise.allSettled(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: shouldCompleteAll }),
        ),
      );

      const updatedIds = todosToUpdate.map((todo, i) =>
        result[i].status === 'fulfilled' ? todo.id : null,
      );

      setTodos(prev =>
        prev.map(todo =>
          updatedIds.includes(todo.id)
            ? { ...todo, completed: shouldCompleteAll }
            : todo,
        ),
      );

      const hasError = result.some(res => res.status === 'rejected');

      if (hasError) {
        setError('Unable to update some todos');
      }
    } finally {
      setIsLoading(false);
      setProcessingTodoId(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading(true);
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds = completedTodos
      .map((todo, i) => (results[i].status === 'fulfilled' ? todo.id : null))
      .filter((id): id is number => id !== null);

    setTodos(prev =>
      prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
    );

    const hasError = results.some(
      // eslint-disable-next-line @typescript-eslint/no-shadow
      results => results.status === 'rejected',
    );

    if (hasError) {
      setError('Unable to delete a todo');
    }

    setIsLoading(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === Filter.active) {
      return !todo.completed;
    }

    if (filter === Filter.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosCount={todos.length}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          isLoading={isLoading}
          newTodo={newTodo}
          inputRef={inputRef}
          handleInputChange={handleInputChange}
          handleFormSubmit={handleFormSubmit}
          handleToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingTodoId={processingTodoId}
          onDelete={handleDeleteTodo}
          onChange={handleToggleCompleted}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onEditStart={handleEditStart}
          onEditCancel={handleEditCancel}
          onEditChange={handleEditChange}
          onEditSubmit={handleEditSubmit}
        />

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};

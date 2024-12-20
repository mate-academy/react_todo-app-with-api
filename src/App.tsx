import React, { useState, useEffect, useRef } from 'react';
import { getTodos, uploadTodo, deleteTodo } from './api/todos';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import Footer from './components/Footer';
import ErrorNotification from './components/ErrorNotification';
import classNames from 'classnames';
import { FilterType } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [haveId, sethaveId] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleError = (message: string) => {
    setError(message);
  };

  useEffect(() => {
    const loadTodos = async () => {
      setError('');

      try {
        const todosFromApi = await getTodos();

        setTodos(todosFromApi);
      } catch {
        setError('Unable to load todos');
      } finally {
      }
    };

    if (USER_ID) {
      loadTodos();
    }
  }, []);

  const handleAddTodo = async (title: string) => {
    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    setNewTodoTitle('');
    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
      deleting: 'idle',
    });

    try {
      const newTodo = await uploadTodo({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
        deleting: 'idle',
      });

      setTodos(prevTodos => [...prevTodos, newTodo]);
      setTempTodo(null);
      setError('');
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      setNewTodoTitle(title);
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos]);

  const handleDeleteTodo = async (todoId: number) => {
    sethaveId(prev => [...prev, todoId]);
    try {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, deleting: 'deleting' } : todo,
        ),
      );

      await deleteTodo(todoId);

      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setError('Unable to delete a todo');
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, deleting: 'idle' } : todo,
        ),
      );
    } finally {
      inputRef.current?.focus();
      sethaveId(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    sethaveId(completedTodos.map(todo => todo.id));
    const deletePromises = completedTodos.map(todo => deleteTodo(todo.id));

    try {
      await Promise.all(deletePromises);
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete completed todos');
    } finally {
      sethaveId([]);
      inputRef.current?.focus();
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);

    const newCompletedStatus = !allCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    sethaveId(todosToUpdate.map(todo => todo.id));

    const updatePromises = todosToUpdate.map(todo =>
      uploadTodo({
        title: todo.title,
        completed: newCompletedStatus,
        userId: todo.userId,
        deleting: 'idle',
      }),
    );

    try {
      await Promise.all(updatePromises);

      setTodos(
        todos.map(todo =>
          todo.completed !== newCompletedStatus
            ? { ...todo, completed: newCompletedStatus }
            : todo,
        ),
      );
    } catch {
      setError('Unable to update todos');
    } finally {
      sethaveId([]);
    }
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
      <h1 className="todoapp__title" data-cy="TodoAppTitle">
        todos
      </h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            aria-label="Mark all as completed"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            onClick={handleToggleAll}
            data-cy="ToggleAllButton"
          />
          <TodoForm
            onAddTodo={handleAddTodo}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            isSubmitting={isSubmitting}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          haveId={haveId}
          setTodos={setTodos}
          onDeleteTodo={handleDeleteTodo}
          onError={handleError}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
            haveId={haveId}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError('')} />
    </div>
  );
};

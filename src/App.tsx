import React, { useEffect, useState, useRef } from 'react';
import { getTodos, USER_ID } from './api/todosApi';

import {
  ErrorNotification,
  FilterType,
  Footer,
  NewTodoField,
  TodoList,
} from './components';
import { Todo } from './types/Todo';
import { createTodo, deleteTodo, updateTodo } from './api/todosApi';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await getTodos();

        setTodos(data);
      } catch (err) {
        //console.error('Error loading todos:', err);
        setError('Unable to load todos');
      } finally {
        setIsLoading(false); //teste de caracter
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!isAddingTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingTodo]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setError(null);
    setProcessingIds(prev => [...prev, updatedTodo.id]);

    try {
      const serverTodo = await updateTodo(updatedTodo.id, {
        title: updatedTodo.title,
        completed: updatedTodo.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo =>
          todo.id === serverTodo.id ? serverTodo : todo,
        ),
      );
    } catch (err) {
      setError('Unable to update a todo');
      throw err;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const isActive = tempTodo && filter === 'active' && !tempTodo.completed;
  const isCompleted = tempTodo && filter === 'completed' && tempTodo.completed;
  const visibleTempTodo =
    tempTodo && (filter === 'all' || isActive || isCompleted) ? tempTodo : null;

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.filter(todo => !todo.completed).length;

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setError(null);
    setIsAddingTodo(true);
    const newTodoData = { title: trimmedTitle, completed: false };

    setTempTodo({ id: 0, userId: USER_ID, ...newTodoData });

    try {
      const createdTodo = await createTodo(newTodoData);
      let uniqueId = createdTodo.id;

      if (!uniqueId || todos.some(t => t.id === uniqueId)) {
        uniqueId = Math.max(0, ...todos.map(t => t.id)) + 1;
      }

      setTodos([...todos, { ...createdTodo, id: uniqueId }]);
      setNewTodoTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setError(null);
    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev => prev.filter(processId => processId !== id));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setError(null);
    if (completedTodos.length === 0) {
      return;
    }

    setProcessingIds(prev => [...prev, ...completedTodos.map(t => t.id)]);
    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(prev => prev.filter(t => !t.completed));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !completedTodos.some(t => t.id === id)),
      );
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <header className="todoapp__header">
        <h1 className="todoapp__title">todos</h1>
        <NewTodoField
          inputRef={inputRef}
          isLoading={isAddingTodo}
          value={newTodoTitle}
          onChange={setNewTodoTitle}
          onSubmit={handleAddTodo}
        />
      </header>

      {(todos.length > 0 || isLoading) && (
        <div className="todoapp__content">
          <TodoList
            todos={visibleTodos}
            tempTodo={visibleTempTodo}
            processingIds={processingIds}
            onDeleteTodo={handleDeleteTodo}
            onToggleTodo={id => {
              const todo = todos.find(t => t.id === id);

              if (todo) {
                handleUpdateTodo({ ...todo, completed: !todo.completed });
              }
            }}
            onUpdateTodo={handleUpdateTodo}
          />

          {todos.length > 0 && (
            <Footer
              activeCount={activeCount}
              completedCount={completedCount}
              selectedFilter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>
      )}

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
// final check

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    newTodoFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LOAD))
      .finally(() => {
        newTodoFieldRef.current?.focus();
      });
  }, []);

  const handleAddTodo = (title: string): Promise<void> => {
    setTempTodo({ id: 0, title, completed: false, userId: USER_ID });

    return createTodo({ title, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.ADD);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        newTodoFieldRef.current?.focus();
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DELETE);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
        newTodoFieldRef.current?.focus();
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo): Promise<void> => {
    setLoadingTodoIds(prev => [...prev, updatedTodo.id]);

    return updateTodo(updatedTodo)
      .then(returnedTodo => {
        setTodos(prev =>
          prev.map(t => (t.id === returnedTodo.id ? returnedTodo : t)),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UPDATE);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const targetStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      handleUpdateTodo({ ...todo, completed: targetStatus }).catch(() => {});
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  const isAllCompleted = todos.length > 0 && todos.every(t => t.completed);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') {
        return !todo.completed;
      }

      if (filter === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          onError={setErrorMessage}
          inputRef={newTodoFieldRef}
          hasTodos={todos.length > 0}
          isAllCompleted={isAllCompleted}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              loadingTodoIds={loadingTodoIds}
            />

            <Footer
              activeCount={activeTodosCount}
              filter={filter}
              onFilterChange={setFilter}
              hasCompleted={todos.some(todo => todo.completed)}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};

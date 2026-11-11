import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos,
  deleteTodo,
  getTodos,
  updateTodo as updateTodoApi,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

interface DeleteResult {
  id: number;
  success: boolean;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [newTodo, setNewTodo] = useState('');
  const [addingTodo, setAddingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const requestsInFlight = useRef(new Set<number>());

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    if (!addingTodo) {
      inputRef.current?.focus();
    }
  }, [addingTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(new Error('Unable to load todos'));
      });
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleUpdateTodo = (
    todo: Todo,
    changes: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<boolean> => {
    if (requestsInFlight.current.has(todo.id)) {
      return Promise.resolve(false);
    }

    requestsInFlight.current.add(todo.id);
    setUpdatingIds(ids => [...ids, todo.id]);

    return updateTodoApi(todo.id, changes)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );

        return true;
      })
      .catch(() => {
        setError(new Error('Unable to update a todo'));

        return false;
      })
      .finally(() => {
        requestsInFlight.current.delete(todo.id);
        setUpdatingIds(ids => ids.filter(id => id !== todo.id));
        inputRef.current?.focus();
      });
  };

  const handleDeleteTodo = (todo: Todo): Promise<boolean> => {
    if (requestsInFlight.current.has(todo.id)) {
      return Promise.resolve(false);
    }

    requestsInFlight.current.add(todo.id);
    setDeletingIds(ids => (ids.includes(todo.id) ? ids : [...ids, todo.id]));

    return deleteTodo(todo.id)
      .then(() => {
        setTodos(current => current.filter(item => item.id !== todo.id));

        return true;
      })
      .catch(() => {
        setError(new Error('Unable to delete a todo'));

        return false;
      })
      .finally(() => {
        requestsInFlight.current.delete(todo.id);
        setDeletingIds(ids => ids.filter(id => id !== todo.id));
        inputRef.current?.focus();
      });
  };

  const handleAddTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setError(new Error('Title should not be empty'));

      return;
    }

    setAddingTodo(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });

    addTodos({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);
        setNewTodo('');
      })
      .catch(() => {
        setError(new Error('Unable to add a todo'));
      })
      .finally(() => {
        setTempTodo(null);
        setAddingTodo(false);
        inputRef.current?.focus();
      });
  };

  const handleToggleAll = () => {
    const completed = !todos.every(todo => todo.completed);

    todos
      .filter(todo => todo.completed !== completed)
      .forEach(todo => {
        void handleUpdateTodo(todo, { completed });
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(ids => [...ids, ...completedTodos.map(todo => todo.id)]);

    Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => ({ id: todo.id, success: true }))
          .catch(() => ({ id: todo.id, success: false })),
      ),
    )
      .then((results: DeleteResult[]) => {
        const deletedIds = results
          .filter(result => result.success)
          .map(result => result.id);

        if (results.some(result => !result.success)) {
          setError(new Error('Unable to delete a todo'));
        }

        setTodos(current =>
          current.filter(todo => !deletedIds.includes(todo.id)),
        );
      })
      .finally(() => {
        const completedIds = completedTodos.map(todo => todo.id);

        setDeletingIds(ids => ids.filter(id => !completedIds.includes(id)));
        inputRef.current?.focus();
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          inputRef={inputRef}
          newTodo={newTodo}
          addingTodo={addingTodo}
          onNewTodoChange={setNewTodo}
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={[...deletingIds, ...updatingIds]}
          onUpdate={handleUpdateTodo}
          onDelete={handleDeleteTodo}
        />

        <Footer
          todos={todos}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};

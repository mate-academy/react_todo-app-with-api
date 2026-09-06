/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
  USER_ID,
} from './api/todos';
// eslint-disable-next-line import/extensions
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorType } from './types/ErrorType';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState<ErrorType>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [focusTrigger, setFocusTrigger] = useState(0);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => setError('load'));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeout = setTimeout(() => {
      setError(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!newTodoTitle.trim()) {
      setError('empty');

      return;
    }

    setIsSubmitting(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    createTodo({
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setError('add');
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setProcessingIds(current => [...current, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('delete');
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== id));
        setFocusTrigger(current => current + 1);
      });
  };

  const handleStatusChange = (id: number, completed: boolean) => {
    setProcessingIds(current => [...current, id]);

    updateTodo(id, completed)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setError('update');
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== id));
        setFocusTrigger(current => current + 1);
      });
  };

  const handleRename = (id: number, newTitle: string) => {
    const todo = todos.find(currentTodo => currentTodo.id === id);

    if (!todo) {
      return Promise.reject();
    }

    setProcessingIds(current => [...current, id]);

    return updateTodo(id, todo.completed, newTitle)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(catchError => {
        setError('update');
        throw catchError;
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(currentId => currentId !== id),
        );
        setFocusTrigger(current => current + 1);
      });
  };

  const handleToggleAll = () => {
    const newCompleted = !allCompleted;
    const idsToProcess = todos
      .filter(todo => todo.completed !== newCompleted)
      .map(todo => todo.id);

    setProcessingIds(current => [...current, ...idsToProcess]);

    Promise.allSettled(idsToProcess.map(id => updateTodo(id, newCompleted)))
      .then(results => {
        const updatedTodos = new Map<number, Todo>();

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            updatedTodos.set(result.value.id, result.value);
          }
        });

        if (results.some(result => result.status === 'rejected')) {
          setError('update');
        }

        setTodos(currentTodos =>
          currentTodos.map(todo => updatedTodos.get(todo.id) || todo),
        );
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !idsToProcess.includes(id)),
        );
        setFocusTrigger(current => current + 1);
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setProcessingIds(current => [...current, ...completedIds]);

    Promise.allSettled(completedIds.map(id => deleteTodo(id).then(() => id)))
      .then(results => {
        const successfulIds = results
          .filter(
            (result): result is PromiseFulfilledResult<number> =>
              result.status === 'fulfilled',
          )
          .map(result => result.value);

        if (results.some(result => result.status === 'rejected')) {
          setError('delete');
        }

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      })
      .finally(() => {
        setProcessingIds(current =>
          current.filter(id => !completedIds.includes(id)),
        );
        setFocusTrigger(current => current + 1);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          allCompleted={allCompleted}
          newTodoTitle={newTodoTitle}
          isSubmitting={isSubmitting}
          onTitleChange={setNewTodoTitle}
          focusTrigger={focusTrigger}
          onSubmit={handleSubmit}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onRename={handleRename}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodos.length}
            hasCompletedTodos={todos.length - activeTodos.length > 0}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};

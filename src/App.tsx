import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Status>(Status.All);
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!tempTodo && processingIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [tempTodo, processingIds]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    setError('');
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => setTempTodo(null));
  };

  const handleDelete = (id: number) => {
    setError('');
    setProcessingIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => setProcessingIds(prev => prev.filter(i => i !== id)));
  };

  const handleUpdate = (todo: Todo) => {
    setError('');
    setProcessingIds(prev => [...prev, todo.id]);

    return updateTodo(todo)
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setProcessingIds(prev => prev.filter(i => i !== todo.id)));
  };

  const handleRename = (todo: Todo, newTitle: string) => {
    setError('');
    setProcessingIds(prev => [...prev, todo.id]);

    return updateTodo({ ...todo, title: newTitle })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(err => {
        setError('Unable to update a todo');
        throw err;
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(i => i !== todo.id));
      });
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === Status.Active) {
        return !todo.completed;
      }

      if (filter === Status.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${todos.every(t => t.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={() => {
                const allDone = todos.every(t => t.completed);

                todos.forEach(t => {
                  if (t.completed === allDone) {
                    handleUpdate({ ...t, completed: !allDone });
                  }
                });
              }}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isLoading={processingIds.includes(todo.id)}
              onDelete={() => handleDelete(todo.id)}
              onUpdate={handleUpdate}
              onRename={newTitle => handleRename(todo, newTitle)}
            />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} isLoading />}
        </section>

        {todos.length > 0 && (
          <TodoFooter
            activeCount={todos.filter(t => !t.completed).length}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={todos.some(t => t.completed)}
            onClear={() =>
              todos.filter(t => t.completed).forEach(t => handleDelete(t.id))
            }
          />
        )}
      </div>
      <ErrorNotification error={error} setError={setError} />
    </div>
  );
};

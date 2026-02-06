/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  useMemo,
  useCallback,
} from 'react';
import { UserWarning } from './UserWarning';
import { ErrorMessage } from './types/AppError';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Filter } from './types/Filter';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

const filterTodos = (todos: Todo[], filter: Filter): Todo[] => {
  switch (filter) {
    case Filter.Active:
      return todos.filter(todo => !todo.completed);
    case Filter.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorMessage>(ErrorMessage.Default);
  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setError(ErrorMessage.LoadTodos);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [todos.length, isAdding]);

  const handleAddTodo = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setError(ErrorMessage.TitleEmpty);

        return;
      }

      setTempTodo({
        id: 0,
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setIsAdding(true);

      addTodo(trimmedTitle)
        .then(newTodo => {
          setTodos(currentTodo => [...currentTodo, newTodo]);
          setError(ErrorMessage.Default);
          setTitle('');
        })
        .catch(() => {
          setError(ErrorMessage.AddTodo);
        })
        .finally(() => {
          setTempTodo(null);
          setIsAdding(false);
        });
    },
    [title],
  );

  const handleRenameTodo = (todoId: number, newTitle: string) => {
    setProcessingTodoIds(prev => [...prev, todoId]);

    return updateTodo(todoId, { title: newTitle })
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);

        return Promise.reject();
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleDeleteTodo = useCallback((todoId: number) => {
    setProcessingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const completed = todos.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    setProcessingTodoIds(prev => [...prev, ...completed.map(todo => todo.id)]);

    const errors: unknown[] = [];
    const deletedIds: number[] = [];

    await Promise.all(
      completed.map(async todo => {
        try {
          await deleteTodo(todo.id);
          deletedIds.push(todo.id);
        } catch (e) {
          errors.push(e);
        }
      }),
    );

    setTodos(prev => prev.filter(todo => !deletedIds.includes(todo.id)));

    setProcessingTodoIds(prev =>
      prev.filter(id => !completed.some(todo => todo.id === id)),
    );

    if (errors.length) {
      setError(ErrorMessage.DeleteTodo);
    } else {
      setError(ErrorMessage.Default);
    }

    inputRef.current?.focus();
  }, [todos]);

  const handleToggleTodo = useCallback((todoId: number, completed: boolean) => {
    setProcessingTodoIds(prev => [...prev, todoId]);

    updateTodo(todoId, { completed })
      .then(newTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === todoId ? newTodo : todo)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const handleToggleAll = useCallback(async () => {
    if (!todos.length) {
      return;
    }

    const newStatus = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setProcessingTodoIds(prev => [
      ...prev,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo(todo.id, { completed: newStatus }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updated = updatedTodos.find(ut => ut.id === todo.id);

          return updated ?? todo;
        }),
      );
      setError(ErrorMessage.Default);
    } catch {
      setError(ErrorMessage.UpdateTodo);
    } finally {
      setProcessingTodoIds(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  }, [todos]);

  const handleFilterChange = (filterStatus: Filter) => {
    setFilter(filterStatus);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (error === ErrorMessage.TitleEmpty) {
      setError(ErrorMessage.Default);
    }
  };

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const hasTodos = Boolean(todos.length);
  const activeCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const completedCount = useMemo(
    () => todos.length - activeCount,
    [todos, activeCount],
  );
  const allTodosCompleted = hasTodos && todos.every(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          onTitleChange={handleTitleChange}
          inputRef={inputRef}
          onSubmit={handleAddTodo}
          disabled={isAdding}
          onToggleAll={handleToggleAll}
          isAllCompleted={allTodosCompleted}
          hasTodos={hasTodos}
        />

        {!isLoading && hasTodos && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingTodoIds={processingTodoIds}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} loading={true} />}

        {/* overlay will cover the todo while it is being deleted or updated */}

        {hasTodos && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={handleFilterChange}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        onClose={() => setError(ErrorMessage.Default)}
      />
    </div>
  );
};

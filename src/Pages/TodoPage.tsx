import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { FilterStatus } from '../types/Status';
import { Todo } from '../types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateManyTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { UserWarning } from '../UserWarning';
import { Header } from '../components/Header';
import { TodoList } from '../components/TodoList';
import { Footer } from '../components/Footer';
import { ErrorNotification } from '../components/ErrorNotification';

export const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const focusedElement = useRef<HTMLInputElement | null>(null);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );

  const areAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const hasTodos = todos.length > 0;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Completed:
          return todo.completed;
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  useEffect(() => {
    setError(null);
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.UnableToLoad);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      focusedElement.current?.focus();
    }
  }, [loading]);

  const closeError = useCallback(() => setError(null), []);

  const handleTodoAdd = (e: React.FormEvent) => {
    e.preventDefault();

    const titleTrim = title.trim();

    if (!titleTrim) {
      setError(ErrorMessages.EmptyTitle);

      return;
    }

    setLoading(true);

    const tempTodoItem: Todo = {
      id: 0,
      userId: USER_ID,
      title: titleTrim,
      completed: false,
    };

    setTempTodo(tempTodoItem);

    addTodo(titleTrim)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => setError(ErrorMessages.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setLoading(false);
      });
  };

  const handleTodoDelete = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        focusedElement.current?.focus();
      })
      .catch(() => setError(ErrorMessages.UnableToDelete))
      .finally(() => {
        setProcessingIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleUpdateTodo = (todo: Todo) => {
    setProcessingIds(ids => [...ids, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo => {
        setTodos(curr => curr.map(t => (t.id === todo.id ? updatedTodo : t)));
      })
      .catch(errors => {
        setError(ErrorMessages.UnableToUpdate);
        throw errors;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  const handleToggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    handleUpdateTodo({ ...todo, completed: !todo.completed });
  };

  const handleRemoveAllCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleTodoDelete(todo.id);
      }
    });
  };

  const handleToggleAll = () => {
    const shouldComplete = !areAllCompleted;

    const itemsToUpdate = todos
      .filter(todo => todo.completed !== shouldComplete)
      .map(t => ({ id: t.id, completed: shouldComplete }));

    const idsToUpdate = itemsToUpdate.map(i => i.id);

    setProcessingIds(prev => [...prev, ...idsToUpdate]);

    updateManyTodos(itemsToUpdate)
      .then(updatedTodosFromBackend => {
        setTodos(updatedTodosFromBackend);
      })
      .catch(() => {
        setError(ErrorMessages.UnableToUpdateSome);
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          activeTodo={areAllCompleted}
          title={title}
          setTitle={setTitle}
          loading={loading}
          onTodoAdd={handleTodoAdd}
          focusedElement={focusedElement}
          toggleAll={handleToggleAll}
          hasTodos={hasTodos}
        />

        {hasTodos && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleTodoDelete}
            onUpdate={handleUpdateTodo}
            onToggle={handleToggleTodo}
            processingIds={processingIds}
          />
        )}

        {hasTodos && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            hasCompletedTodos={hasCompletedTodos}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleRemoveAllCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} onClose={closeError} />
    </div>
  );
};

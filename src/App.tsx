/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [status, setStatus] = useState<FilterStatus>(FilterStatus.All);

  const [title, setTitle] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const newTodoField = useRef<HTMLInputElement>(null);
  const filters = Object.values(FilterStatus);
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.some(todo => todo.completed);

  const filteredTodos = useCallback(
    (list: Todo[]) => {
      let result = [...list];

      if (status === 'Active') {
        result = result.filter(t => !t.completed);
      } else if (status === 'Completed') {
        result = result.filter(t => t.completed);
      }

      return result;
    },
    [status],
  );

  const visibleTodos = useMemo(() => {
    return filteredTodos(todos);
  }, [filteredTodos, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadError);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!tempTodo && newTodoField.current) {
      newTodoField.current.focus();
    }
  }, [tempTodo, newTodoField]);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitleError);

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    });

    createTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddError);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setLoadingIds(ids => [...ids, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.DeleteError);
        throw error;
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
        if (newTodoField.current) {
          newTodoField.current.focus();
        }
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDelete(todo.id);
      }
    });
  };

  const handleUpdate = (todoId: number, data: Partial<Todo>) => {
    setLoadingIds(ids => [...ids, todoId]);

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UpdateError);
        throw error;
      })
      .finally(() => {
        setLoadingIds(ids => ids.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => {
      handleUpdate(todo.id, { completed: newStatus });
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
          title={title}
          setTitle={setTitle}
          onSubmit={handleSubmit}
          newTodoField={newTodoField}
          tempTodo={tempTodo}
          onToggleAll={handleToggleAll}
          todos={todos}
          activeTodos={activeTodos}
        />
        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              tempTodo={tempTodo}
              handleDelete={handleDelete}
              isLoading={loadingIds}
              onUpdate={handleUpdate}
            />
            <Footer
              status={status}
              setStatus={setStatus}
              filters={filters}
              activeTodos={activeTodos}
              completedTodos={completedTodos}
              onClearCopleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

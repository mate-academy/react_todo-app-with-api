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
  addTodos,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { Footer } from './components/Footer';
import { TodoForm } from './components/TodoForm';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.Default,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        case FilterStatus.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const handleDeleteTodo = useCallback((id: number) => {
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(presentTodos => presentTodos.filter(todo => todo.id !== id));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setProcessingIds(currentIds =>
          currentIds.filter(todoId => todoId !== id),
        );
      });
  }, []);

  const handleUpdateTodo = useCallback((todo: Todo) => {
    setProcessingIds(ids => [...ids, todo.id]);

    return updateTodo(todo)
      .then(updatedTodo => {
        setTodos(curr => curr.map(t => (t.id === todo.id ? updatedTodo : t)));
      })
      .catch(error => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todo.id));
      });
  }, []);

  const handleToggleTodo = useCallback(
    (id: number) => {
      const todo = todos.find(t => t.id === id);

      if (!todo) {
        return;
      }

      handleUpdateTodo({ ...todo, completed: !todo.completed });
    },
    [todos, handleUpdateTodo],
  );

  const handleClearCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, [todos, handleDeleteTodo]);

  const isAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const handleToggleAll = useCallback(() => {
    const idsToUpdate = todos
      .filter(todo => todo.completed !== !isAllCompleted)
      .map(todo => todo.id);

    setProcessingIds(ids => [...ids, ...idsToUpdate]);

    Promise.allSettled(
      todos
        .filter(todo => idsToUpdate.includes(todo.id))
        .map(todo => updateTodo({ ...todo, completed: !isAllCompleted })),
    )
      .then(results => {
        if (results.some(r => r.status === 'rejected')) {
          setErrorMessage(ErrorMessage.UpdateSomeTodos);
        }

        setTodos(curr =>
          curr.map(todo =>
            idsToUpdate.includes(todo.id)
              ? { ...todo, completed: !isAllCompleted }
              : todo,
          ),
        );
      })
      .finally(() => {
        setProcessingIds(ids => ids.filter(id => !idsToUpdate.includes(id)));
      });
  }, [todos, isAllCompleted]);

  const handleAddTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const cleanTitle = title.trim();

      if (!cleanTitle) {
        setErrorMessage(ErrorMessage.EmptyTitle);

        return;
      }

      setIsLoading(true);

      const tempTodoItem: Todo = {
        id: 0,
        userId: USER_ID,
        title: cleanTitle,
        completed: false,
      };

      setTempTodo(tempTodoItem);

      addTodos(cleanTitle)
        .then(newTodo => {
          setTodos(prev => [...prev, newTodo]);
          setTitle('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.AddTodo);
        })
        .finally(() => {
          setIsLoading(false);
          setTempTodo(null);
        });
    },
    [title],
  );

  const handleSetErrorMessage = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todos={todos}
          title={title}
          setTitle={setTitle}
          handleAddTodo={handleAddTodo}
          isLoading={isLoading}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
            onUpdate={handleUpdateTodo}
            onToggle={handleToggleTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={handleSetErrorMessage}
      />
    </div>
  );
};

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterBy } from './types/FilterBy';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { UpdateTodo } from './types/UpdateTodo';

export const App: React.FC = () => {
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingItemIds, setLoadingItemIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const { visibleTodos, activeTodosAmount } = useMemo(() => {
    const active = todos.filter(todo => !todo.completed);

    return {
      visibleTodos:
        filterBy === FilterBy.All
          ? todos
          : filterBy === FilterBy.Active
            ? active
            : todos.filter(todo => todo.completed),
      activeTodosAmount: active.length,
    };
  }, [todos, filterBy]);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const hideError = useCallback(() => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorMessage(ErrorMessage.None);
  }, []);

  const showError = useCallback((message: ErrorMessage) => {
    setErrorMessage(message);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
      errorTimerRef.current = null;
    }, 3000);
  }, []);

  const loadTodos = useCallback(() => {
    hideError();
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => setTempTodo(null));
  }, [showError, hideError]);

  const finalizeAction = useCallback(
    (idsToRemove: number[] = []) => {
      setLoadingItemIds(prev => prev.filter(id => !idsToRemove.includes(id)));
      focusInput();
    },
    [focusInput],
  );

  const createTodo = useCallback(
    (trimmedTitle: string) => {
      const newTodo: Todo = {
        id: 0,
        userId: todoService.USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      hideError();
      setTempTodo(newTodo);
      setLoadingItemIds(prev => [...prev, 0]);

      todoService
        .createTodo({
          title: trimmedTitle,
          completed: false,
          userId: todoService.USER_ID,
        })
        .then(newTodoFromServer => {
          setTodos(prev => [...prev, newTodoFromServer]);
          setTitle('');
        })
        .catch(() => showError(ErrorMessage.Create))
        .finally(() => {
          setTempTodo(null);
          finalizeAction([0]);
        });
    },
    [showError, hideError, finalizeAction],
  );

  const updateTodo = useCallback(
    (todo: Todo, type: UpdateTodo, updatedTitle?: string): Promise<void> => {
      hideError();
      setLoadingItemIds(prev => [...prev, todo.id]);

      const sendUpdate = (updatedTodo: Todo) => {
        return todoService
          .updateTodo(updatedTodo)
          .then(() => {
            setTodos(prev =>
              prev.map(t => (t.id === todo.id ? updatedTodo : t)),
            );
          })
          .catch(() => {
            showError(ErrorMessage.Update);
            finalizeAction([todo.id]);

            return Promise.reject(new Error(ErrorMessage.Update));
          })
          .finally(() => finalizeAction([todo.id]));
      };

      if (type === UpdateTodo.Status) {
        const updatedTodo = { ...todo, completed: !todo.completed };

        return sendUpdate(updatedTodo);
      }

      if (type === UpdateTodo.Title) {
        const trimmedTitle = updatedTitle?.trim();

        if (!trimmedTitle) {
          showError(ErrorMessage.TitleValidation);
          finalizeAction([todo.id]);

          return Promise.reject(new Error(ErrorMessage.TitleValidation));
        }

        const updatedTodo = { ...todo, title: trimmedTitle };

        return sendUpdate(updatedTodo);
      }

      return Promise.resolve();
    },
    [showError, hideError, finalizeAction],
  );

  const deleteTodo = useCallback(
    (id: number) => {
      hideError();
      setLoadingItemIds(prev => [...prev, id]);

      todoService
        .deleteTodo(id)
        .then(() => setTodos(prev => prev.filter(t => t.id !== id)))
        .catch(() => showError(ErrorMessage.Delete))
        .finally(() => finalizeAction([id]));
    },
    [showError, hideError, finalizeAction],
  );

  const clearCompletedTodos = useCallback(async () => {
    const completed = todos.filter(t => t.completed);

    if (!completed.length) {
      return;
    }

    hideError();
    setLoadingItemIds(prev => [...prev, ...completed.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        completed.map(t => todoService.deleteTodo(t.id)),
      );
      const successful = completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      setTodos(prev => prev.filter(t => !successful.includes(t.id)));

      if (results.some(r => r.status === 'rejected')) {
        showError(ErrorMessage.Delete);
      }
    } finally {
      setLoadingItemIds([]);
      focusInput();
    }
  }, [todos, showError, hideError, focusInput]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        showError(ErrorMessage.TitleValidation);

        return;
      }

      createTodo(trimmedTitle);
    },
    [title, createTodo, showError],
  );

  const handleTodosToggle = useCallback(() => {
    const todosToUpdate = !activeTodosAmount
      ? todos
      : todos.filter(todo => !todo.completed);

    Promise.all(
      todosToUpdate.map(todo => updateTodo(todo, UpdateTodo.Status)),
    ).catch(() => {
      showError(ErrorMessage.Update);
    });
  }, [todos, showError, activeTodosAmount, updateTodo]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          query={title}
          onTitleChange={setTitle}
          loadingItemIds={loadingItemIds}
          handleTodosToggle={handleTodosToggle}
          activeTodosAmount={activeTodosAmount}
          handleSubmit={handleSubmit}
          inputRef={inputRef}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingItemIds={loadingItemIds}
          handleDelete={deleteTodo}
          handleUpdate={updateTodo}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        {!!todos.length && (
          <Footer
            todos={todos}
            activeTodosAmount={activeTodosAmount}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            onClearCompleted={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} hideError={hideError} />
    </div>
  );
};

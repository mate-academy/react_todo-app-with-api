import {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './components/UserWarning';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  updateTodo,
  uploadTodo,
} from './api/todos';
import { emptyTodo, errorDelay } from './utils/const';
import { Errors, ErrorsTypes } from './types/Error';
import { Todo, TodoStatus, UpdateTodoData } from './types/Todo';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingsTodos, setProcessingsTodos] = useState<number[]>([]);
  const [error, setError] = useState<ErrorsTypes | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteringTodosByActiveStatus = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const filteringTodosByCompletedStatus = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const filteringTodosByStatus = useMemo(() => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return filteringTodosByActiveStatus;

      case TodoStatus.Completed:
        return filteringTodosByCompletedStatus;

      default:
        return todos;
    }
  }, [
    filteringTodosByActiveStatus,
    filteringTodosByCompletedStatus,
    selectedStatus,
    todos,
  ]);

  const changeTodoTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError('');
      setTodoTitle(e.target.value);
    },
    [],
  );

  const addTodo = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!todoTitle.trim().length) {
        setError(Errors.VALIDATION);

        return;
      }

      setIsLoading(true);
      setError('');

      const newTempTodo: Todo = { ...emptyTodo, title: todoTitle.trim() };

      setTempTodo(newTempTodo);
      setProcessingsTodos([newTempTodo.id]);

      try {
        const todo = await uploadTodo({
          ...emptyTodo,
          title: todoTitle.trim(),
        });

        setTodos(currentTodos => [...currentTodos, todo]);
        setTodoTitle('');
      } catch {
        setError(Errors.ADD);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
        setProcessingsTodos([]);
        focusInputField();
      }
    },
    [todoTitle],
  );

  const onDeleteTodo = useCallback((id: number) => {
    deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(t => t.id !== id));
      })
      .catch(() => {
        setError(Errors.DELETE);
      })
      .finally(() => {
        setProcessingsTodos(prev => prev.filter(prevItem => prevItem !== id));
        focusInputField();
      });
  }, []);

  const removeTodo = useCallback(
    (id: number) => {
      setError('');
      setProcessingsTodos(prev => [...prev, id]);

      onDeleteTodo(id);
    },
    [onDeleteTodo],
  );

  const removeTodos = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const deletePromises = filteringTodosByCompletedStatus.map(todo => {
      removeTodo(todo.id);
    });

    await Promise.allSettled(deletePromises);
    setIsLoading(false);
  }, [filteringTodosByCompletedStatus, removeTodo]);

  const onUpdateTodo = useCallback(async (id: number, data: UpdateTodoData) => {
    return updateTodo(id, data)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === todo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
        setEditingTodoId(null);
      })
      .catch(() => {
        setError(Errors.UPDATE);
        if (data.hasOwnProperty('title')) {
          setEditingTodoId(id);
          throw new Error();
        }
      })
      .finally(() => {
        setProcessingsTodos(prev => prev.filter(prevItem => prevItem !== id));
        if (!data.hasOwnProperty('title')) {
          focusInputField();
        }
      });
  }, []);

  const toggleTodoStatus = useCallback(
    (id: number, data: UpdateTodoData) => {
      setError('');
      setProcessingsTodos(prev => [...prev, id]);
      onUpdateTodo(id, data);
    },
    [onUpdateTodo],
  );

  const toggleAll = useCallback(async () => {
    setIsLoading(true);
    setError('');

    let todosForChange: Todo[] = [];

    if (filteringTodosByCompletedStatus.length !== todos.length) {
      todosForChange = [...filteringTodosByActiveStatus];
    } else if (
      filteringTodosByCompletedStatus.length === todos.length ||
      filteringTodosByActiveStatus.length === todos.length
    ) {
      todosForChange = [...todos];
    }

    const togglePromises = todosForChange.map(todo => {
      toggleTodoStatus(todo.id, { completed: !todo.completed });
    });

    await Promise.allSettled(togglePromises);
    setIsLoading(false);
  }, [
    filteringTodosByActiveStatus,
    filteringTodosByCompletedStatus.length,
    todos,
    toggleTodoStatus,
  ]);

  const selectedEditTodoId = (id: number | null) => {
    setEditingTodoId(id);
  };

  const selectedStatusTodosHandler = useCallback((todoStatus: TodoStatus) => {
    setSelectedStatus(todoStatus);
  }, []);

  const updateProcessingsTodos = (id: number) => {
    setProcessingsTodos(prev => [...prev, id]);
  };

  const removeProcessingsTodos = (id: number) => {
    setProcessingsTodos(prev => prev.filter(prevItem => prevItem !== id));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, errorDelay);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    focusInputField();
  }, [todoTitle, todos, selectedStatus, isLoading]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Errors.LOAD_TODOS));
    focusInputField();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          value={todoTitle}
          onChange={changeTodoTitleHandler}
          addTodo={addTodo}
          inputRef={inputRef}
          isLoading={isLoading}
          todosCount={todos.length}
          completedTodosCount={filteringTodosByCompletedStatus.length}
          toggleAll={toggleAll}
        />

        <TodoList
          removeTodo={removeTodo}
          processingsTodos={processingsTodos}
          tempTodo={tempTodo}
          visibleTodos={filteringTodosByStatus}
          toggleTodoStatus={toggleTodoStatus}
          error={error}
          editingTodoId={editingTodoId}
          selectedEditTodoId={selectedEditTodoId}
          onUpdateTodo={onUpdateTodo}
          updateProcessingsTodos={updateProcessingsTodos}
          removeProcessingsTodos={removeProcessingsTodos}
        />

        {(todos.length !== 0 || tempTodo) && (
          <Footer
            setStatus={selectedStatusTodosHandler}
            activeTodosCount={filteringTodosByActiveStatus.length}
            completedTodosCount={filteringTodosByCompletedStatus.length}
            selectedStatus={selectedStatus}
            removeTodos={removeTodos}
          />
        )}
      </div>

      <ErrorNotification error={error} setError={() => setError('')} />
    </div>
  );
};

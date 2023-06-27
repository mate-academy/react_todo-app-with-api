import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { ThreeDots } from 'react-loader-spinner';
import {
  getTodos,
  deleteTodo,
  updateTodo,
  createTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Error } from './types/Errors';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/TodosFilter';
import { Notification } from './components/Notification';
import { Footer } from './components/Footer';

const USER_ID = 10353;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(Error.LOAD);
    }

    setIsLoading(false);
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterBy.ALL:
          return true;

        case FilterBy.COMPLETED:
          return todo.completed;

        case FilterBy.ACTIVE:
          return !todo.completed;

        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosLength = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed === true);
  }, [todos]);

  const addLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(prevIds => [...prevIds, todoId]);
  };

  const removeLoadingTodoId = (todoId: number) => {
    setLoadingTodoIds(prevIds => prevIds.filter(id => id !== todoId));
  };

  const handleAddTodo = useCallback(async (newTodo: Todo) => {
    setTempTodo(newTodo);

    try {
      const todoToAdd = await createTodo({
        id: 0,
        title: newTodo.title,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prevTodos) => [...prevTodos, todoToAdd]);
    } catch {
      setErrorMessage(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    try {
      addLoadingTodoId(todoToDelete.id);
      await deleteTodo(todoToDelete.id);
      setTodos((prevTodos) => prevTodos
        .filter((todo) => todo.id !== todoToDelete.id));
    } catch {
      setErrorMessage(Error.DELETE);
    } finally {
      removeLoadingTodoId(todoToDelete.id);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      completedTodos.map(todo => handleDelete(todo));
    } catch {
      setErrorMessage(Error.DELETE);
    }
  }, [todos]);

  const handleUpdateCompletedTodo = useCallback(
    async (id: number, completed: boolean) => {
      addLoadingTodoId(id);

      const updatePromises = todos
        .filter((todo) => todo.id === id)
        .map((todo) => updateTodo(todo.id, { completed }));

      try {
        await Promise.all(updatePromises);

        setTodos((prevTodos) => prevTodos
          .map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
      } catch {
        setErrorMessage(Error.UPDATE);
      } finally {
        removeLoadingTodoId(id);
      }
    }, [todos],
  );

  const handleUpdateTodoTitle = useCallback(
    async (id: number, title: string) => {
      addLoadingTodoId(id);
      try {
        await updateTodo(id, { title });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        }));
      } catch {
        setErrorMessage(Error.UPDATE);
      } finally {
        removeLoadingTodoId(id);
      }
    }, [],
  );

  const handleToggleAll = useCallback(() => {
    if (!activeTodosLength) {
      todos.forEach(todo => {
        handleUpdateCompletedTodo(todo.id, !todo.completed);
      });
    } else {
      todos.forEach(todo => {
        if (!todo.completed) {
          handleUpdateCompletedTodo(todo.id, !todo.completed);
        }
      });
    }
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading ? (
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#eb8a44"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible
        />
      ) : (
        <div className="todoapp__content">
          <Header
            onAddTodo={handleAddTodo}
            onToggleAll={handleToggleAll}
            onError={setErrorMessage}
            activeTodosLength={activeTodosLength}
          />

          {!!todos.length && (
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDelete}
              onCompleteUpdate={handleUpdateCompletedTodo}
              onTitleUpdate={handleUpdateTodoTitle}
            />
          )}

          {!!todos.length && (
            <Footer
              activeTodosLength={activeTodosLength}
              filter={filter}
              setFilter={setFilter}
              handleDeleteCompletedTodos={handleDeleteCompletedTodos}
            />
          )}
        </div>
      )}

      {errorMessage && (
        <Notification
          message={errorMessage}
          handleMessage={setErrorMessage}
        />
      )}
    </div>
  );
};

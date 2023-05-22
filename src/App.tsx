import {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
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
import { TodoFilter } from './components/TodoFilter';
import { Notification } from './components/Notification';

const USER_ID = 10353;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: string) => {
    setErrorMessage(error);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const loadTodos = useCallback(async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch (error) {
      handleError(Error.LOAD);
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
      handleError(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const handleDelete = useCallback(async (todoToDelete: Todo) => {
    setIsLoading(true);
    try {
      await deleteTodo(todoToDelete.id);
      setTodos((prevTodos) => prevTodos
        .filter((todo) => todo.id !== todoToDelete.id));
    } catch {
      handleError(Error.DELETE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteCompletedTodos = useCallback(async () => {
    try {
      completedTodos.map(todo => handleDelete(todo));
    } catch {
      handleError(Error.DELETE);
    }
  }, [todos]);

  const handleUpdateCompletedTodo = useCallback(
    async (id: number, completed: boolean) => {
      try {
        await updateTodo(id, { completed });

        setTodos((prevTodos) => prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed,
            };
          }

          return todo;
        }));
      } catch {
        handleError(Error.UPDATE);
      }
    }, [todos],
  );

  const handleUpdateTodoTitle = useCallback(
    async (id: number, title: string) => {
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
        handleError(Error.UPDATE);
      }
    }, [],
  );

  const handleToggleAll = useCallback(async () => {
    if (!activeTodosLength) {
      todos.forEach(todo => {
        handleUpdateCompletedTodo(todo.id, !todo.completed);
      });

      return;
    }

    todos.forEach(todo => {
      if (!todo.completed) {
        handleUpdateCompletedTodo(todo.id, !todo.completed);
      }
    });
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, [visibleTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          onToggleAll={handleToggleAll}
          onError={handleError}
          activeTodosLength={activeTodosLength}
        />

        {!!todos.length && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            onDelete={handleDelete}
            onCompleteUpdate={handleUpdateCompletedTodo}
            onTitleUpdate={handleUpdateTodoTitle}
            isLoading={isLoading}
          />
        )}

        {!!todos.length && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodosLength} items left`}
            </span>

            <TodoFilter
              filter={filter}
              onSetFilter={setFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleDeleteCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <Notification
        message={errorMessage}
        handleMessage={handleError}
      />
    </div>
  );
};

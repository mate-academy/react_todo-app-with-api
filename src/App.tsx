import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { UserWarning } from './UserWarning';

import { useLoadingTodosContext } from './contexts/useLoadingTodosContext';

import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList/TodoList';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoItem } from './components/TodoItem';
import {
  getTodos,
  postTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import type { Todo } from './types/Todo';
import { FilterType } from './enums/FilterType';

enum NotificationType {
  Success = 'success',
  Error = 'error',
  Loading = 'Loading',
}

const USER_ID = 6712;

const notify = (message: string, type: NotificationType) => {
  const position = 'top-center';
  const iconTheme = {
    primary: '#FFA62B',
    secondary: '#0F1108',
  };

  switch (type) {
    case NotificationType.Error:
      toast.error(message, {
        duration: 3000,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Success:
      toast.success(message, {
        duration: 1000,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Loading:
      toast.loading(message, {
        duration: 500,
        position,
      });
      break;
    default:
      toast(message);
  }
};

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const { setLoadingTodosIds } = useLoadingTodosContext();

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );
  const uncompletedTodos = useMemo(
    () => todos.filter(({ completed }) => !completed),
    [todos],
  );

  const [activeTodosCount, completedTodosCount] = useMemo(
    () => [uncompletedTodos.length, completedTodos.length],
    [todos],
  );

  const addToLoadingTodoIds = (todoId: number) => {
    setLoadingTodosIds((prev: number[]) => [...prev, todoId]);
  };

  const removeFromLoadingTodoIds = (todoId: number) => {
    setLoadingTodosIds((prev: number[]) => prev.filter((id) => todoId !== id));
  };

  useEffect(() => {
    notify('Loading todos...', NotificationType.Loading);

    (async () => {
      try {
        const fetchedTodos = await getTodos(USER_ID);

        setTodos(fetchedTodos);
        notify('Successfully loaded todos!', NotificationType.Success);
      } catch (error) {
        notify('Unable to load todos!', NotificationType.Error);
      }
    })();
  }, []);

  const handleAddTodo = async (title: string) => {
    setIsInputDisabled(true);

    if (!title.length) {
      notify("Title can't be empty!", NotificationType.Error);
    } else {
      notify('Adding new todo...', NotificationType.Loading);
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };
      const { id, ...newTodoData } = newTodo;

      setTempTodo(newTodo);
      addToLoadingTodoIds(id);

      try {
        const postedTodo = await postTodo(newTodoData);

        setTodos((prevTodos) => {
          notify('Successfully added new todo!', NotificationType.Success);

          return [...prevTodos, postedTodo];
        });
      } catch {
        notify('Unable to add a todo!', NotificationType.Error);
      } finally {
        setTempTodo(null);
        removeFromLoadingTodoIds(id);
      }
    }

    setIsInputDisabled(false);
  };

  const handleDeleteTodo = useCallback(
    async (id: number, doNotNotify?: boolean) => {
      addToLoadingTodoIds(id);

      if (!doNotNotify) {
        notify('Deleting todo...', NotificationType.Loading);
      }

      try {
        await deleteTodo(id);

        setTodos((prevTodos) => {
          if (!doNotNotify) {
            notify('Successfully deleted a todo!', NotificationType.Success);
          }

          return prevTodos.filter((todo) => todo.id !== id);
        });
      } catch (error) {
        notify('Unable to delete a todo!', NotificationType.Error);
      } finally {
        setTempTodo(null);
        removeFromLoadingTodoIds(id);
      }
    },
    [deleteTodo],
  );

  const handleDeleteCompleted = () => {
    completedTodos.forEach(({ id }) => handleDeleteTodo(id, true));
    notify('Successfully deleted completed todos!', NotificationType.Success);
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    addToLoadingTodoIds(id);

    try {
      const updatedTodo = await updateTodo(id, data);

      setTodos((prev) => prev.map((prevTodo) => {
        if (prevTodo.id === updatedTodo.id) {
          return {
            ...prevTodo,
            ...updatedTodo,
          };
        }

        return prevTodo;
      }));
    } catch {
      notify('Unable to update a todo!', NotificationType.Error);
    } finally {
      removeFromLoadingTodoIds(id);
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(({ completed }) => completed === true);

    if (areAllCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      uncompletedTodos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const containerClassNames = [
    'flex',
    'pt-20',
    'min-h-screen',
    'bg-base-200',
    'justify-center',
    'selection:bg-primary',
    'selection:text-white',
    'max-md:px-4',
  ].join(' ');

  const todoCardClassNames = [
    'card',
    'bg-base-100',
    'shadow-xl',
    'h-3/4',
    'xs:max-sm:w2/3',
    'md:w-1/2',
    'lg:w-1/2',
    'xl:w-1/3',
    '2xl:w-1/4',
  ].join(' ');

  return (
    <div className={containerClassNames}>
      <div className={todoCardClassNames}>
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center text-primary mb-4">
            ToDo
            <span className="text-secondary">{' {App}'}</span>
          </h1>

          <header className="flex gap-2">
            <NewTodoForm
              isInputDisabled={isInputDisabled}
              onSubmit={handleAddTodo}
            />
          </header>

          {todos.length > 0 && (
            <TodoFilter
              currentFilterType={filterType}
              isAnyActiveTodos={activeTodosCount > 0}
              isAnyCompletedTodos={completedTodosCount > 0}
              onClearCompleted={handleDeleteCompleted}
              changeFilterType={setFilterType}
              onToggleAllTodos={handleToggleAll}
            />
          )}

          <div className="divider my-2">
            {activeTodosCount > 0
              ? `${activeTodosCount} tasks left`
              : 'No tasks'}
          </div>

          <TodoList
            todos={todos}
            filterType={filterType}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
          />

          {tempTodo && (
            <TodoItem
              onDelete={handleDeleteTodo}
              todo={tempTodo}
              onUpdate={handleUpdateTodo}
            />
          )}
        </div>
      </div>

      <Toaster />
    </div>
  );
};

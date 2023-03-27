import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { LoadingTodosContext } from './LoadingTodosContext';
import { UserWarning } from './UserWarning';
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
  const duration = 3000;
  const position = 'top-center';
  const iconTheme = {
    primary: '#FFA62B',
    secondary: '#0F1108',
  };

  switch (type) {
    case NotificationType.Error:
      toast.error(message, {
        duration,
        position,
        iconTheme,
      });
      break;
    case NotificationType.Success:
      toast.success(message, {
        duration,
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
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);

  const getCompletedTodos = () => todos.filter(({ completed }) => completed);
  const getUnCompletedTodos = () => todos.filter(({ completed }) => !completed);

  const [activeTodosCount, completedTodosCount] = useMemo(
    () => [getUnCompletedTodos().length, getCompletedTodos().length],
    [todos],
  );

  useEffect(() => {
    notify('Loading todos...', NotificationType.Loading);

    getTodos(USER_ID)
      .then((fetchedTodos) => {
        window.console.log(fetchedTodos);
        setTodos(fetchedTodos);
        notify('Successfully loaded todos!', NotificationType.Success);
      })
      .catch(() => {
        notify('Unable to load todos!', NotificationType.Error);
      });
  }, []);

  const handleAddTodo = async (title: string) => {
    setIsInputDisabled(true);
    notify('Adding new todo...', NotificationType.Loading);

    if (!title.length) {
      notify("Title can't be empty!", NotificationType.Error);
    } else {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        completed: false,
        title,
      };

      setTempTodo(newTodo);
      setLoadingTodosIds((prev: number[]) => [...prev, newTodo.id]);

      try {
        const postedTodo = await postTodo(newTodo);

        setTodos((prevTodos) => {
          notify('Successfully added new todo!', NotificationType.Success);

          return [...prevTodos, postedTodo];
        });
      } catch {
        notify('Unable to add a todo!', NotificationType.Error);
      } finally {
        setTempTodo(null);
        setLoadingTodosIds([]);
      }
    }

    setIsInputDisabled(false);

    // if (!title.length) {
    //   setIsInputDisabled(false);
    //   notify("Title can't be empty!", NotificationType.Error);
    // } else {
    //   const newTodo = {
    //     id: 0,
    //     userId: USER_ID,
    //     completed: false,
    //     title,
    //   };

    //   setTempTodo(newTodo);
    //   setLoadingTodosIds((prev: number[]) => [...prev, newTodo.id]);

    //   postTodo(newTodo)
    //     .then((todo) => {
    //       setTodos((prevTodos) => {
    //         notify('Successfully added new todo!', NotificationType.Success);

    //         return [...prevTodos, todo];
    //       });
    //     })
    //     .catch(() => {
    //       notify('Unable to add a todo!', NotificationType.Error);
    //     })
    //     .finally(() => {
    //       setTempTodo(null);
    //       setLoadingTodosIds([]);
    //       setIsInputDisabled(false);
    //     });
    // }
  };

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setLoadingTodosIds((prev: number[]) => [...prev, id]);
      notify('Deleting todo...', NotificationType.Loading);

      try {
        const deletedTodo = await deleteTodo(id);

        setTodos((prevTodos) => {
          notify('Successfully deleted a todo!', NotificationType.Success);

          return prevTodos.filter((todo) => todo.id !== id);
        });

        return deletedTodo;
      } catch (error) {
        notify('Unable to delete a todo!', NotificationType.Error);
      } finally {
        setTempTodo(null);
        setLoadingTodosIds([]);
      }

      return null;

      // return deleteTodo(id)
      //   .then(() => {
      //     setTodos((prevTodos) => {
      //       notify('Successfully deleted a todo!', NotificationType.Success);

      //       return prevTodos.filter((todo) => todo.id !== id);
      //     });
      //   })
      //   .catch(() => {
      //     notify('Unable to delete a todo!', NotificationType.Error);
      //   })
      //   .finally(() => {
      //     setTempTodo(null);
      //     setLoadingTodosIds([]);
      //   });
    },
    [deleteTodo],
  );

  const handleDeleteCompleted = () => {
    getCompletedTodos().forEach(({ id }) => {
      handleDeleteTodo(id).then(() => setTodos(getUnCompletedTodos()));
    });
  };

  const handleUpdateTodo = async (id: number, data: Partial<Todo>) => {
    setLoadingTodosIds((prev) => [...prev, id]);

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
      setLoadingTodosIds([]);
    }
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(({ completed }) => completed === true);

    if (areAllCompleted) {
      todos.forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: false });
      });
    } else {
      getUnCompletedTodos().forEach((todo) => {
        handleUpdateTodo(todo.id, { completed: true });
      });
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <LoadingTodosContext.Provider
      value={{
        loadingTodosIds,
      }}
    >
      <div
        className="
        flex pt-20 min-h-screen bg-base-200 justify-center
        selection:bg-primary selection:text-white max-md:px-4"
      >
        <div
          className="card xs:max-sm:w2/3 md:w-1/2 h-3/4
          lg:w-1/2 xl:w-1/3 2xl:w-1/4 bg-base-100 shadow-xl"
        >
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

          <Toaster />
        </div>
      </div>
    </LoadingTodosContext.Provider>
  );
};

import {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { SortTypes } from './types/SortTypes';
import { TodoError } from './types/TodoError';
import { USER_ID } from './consts/consts';
import { Loader } from './components/Loader';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [activeFilter, setActiveFilter] = useState<SortTypes>(SortTypes.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [todoId, setTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);

  const handleError = (message: TodoError) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const loadTodos = useCallback(async () => {
    try {
      setIsloading(true);
      const response = await getTodos(USER_ID);

      setTodos(response);
      setIsloading(false);
    } catch (error: unknown) {
      handleError(TodoError.LOAD);
    }
  }, []);

  const addTodo = useCallback(async (todoData: Todo) => {
    setTodoId(0);
    setTempTodo(todoData);
    setIsDisabledInput(true);

    try {
      const newTodo = await createTodo({
        title: todoData.title,
        completed: false,
        userId: USER_ID,
      });

      setTodos((prevTodos) => [...prevTodos, newTodo]);
    } catch {
      handleError(TodoError.LOAD);
    }

    setTempTodo(null);
    setTodoId(null);
    setIsDisabledInput(false);
  }, []);

  const updateStatusTodo = useCallback(async (
    id: number,
    completed: boolean,
  ) => {
    try {
      await updateTodoStatus(id, completed);

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
      handleError(TodoError.UPDATE);
    }

    setTodoId(null);
  }, []);

  const updateTitleTodo = useCallback(async (id: number, newTitle: string) => {
    try {
      await updateTodoTitle(id, newTitle);

      setTodos((prevTodos) => prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title: newTitle,
          };
        }

        return todo;
      }));
    } catch {
      handleError(TodoError.UPDATE);
    }
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    try {
      await removeTodo(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch {
      handleError(TodoError.DELETE);
    }
  }, []);

  const clearCompletedTodos = useCallback(async () => {
    try {
      const completedTodos = todos.filter(({ completed }) => completed);

      setCompletedTodosId(completedTodos.map(({ id }) => id));

      await Promise.all(completedTodos.map(({ id }) => removeTodo(
        id,
      )));

      setTodos((prevTodos) => prevTodos.filter(({ completed }) => !completed));
    } catch {
      handleError(TodoError.DELETE);
    }

    setTodoId(null);
  }, [todos]);

  const vissibleTodos = useMemo(() => todos.filter((todo) => {
    switch (activeFilter) {
      case SortTypes.Active:
      case SortTypes.AllCompleted:
        return !todo.completed;

      case SortTypes.Completed:
        return todo.completed;

      default:
        return true;
    }
  }), [todos, activeFilter]);

  useEffect(() => {
    loadTodos();
  }, []);

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
          onAddTodo={addTodo}
          onError={handleError}
        />

        {
          isLoading
            ? <Loader />
            : (
              <TodoList
                todos={vissibleTodos}
                todoId={todoId}
                tempTodo={tempTodo}
                isDisabledInput={isDisabledInput}
                completedTodosId={completedTodosId}
                setTodoId={setTodoId}
                onDelete={deleteTodo}
                onChangeStatus={updateStatusTodo}
                onChangeTitle={updateTitleTodo}
              />
            )
        }
        {todos.length > 0 && (
          <Footer
            todos={vissibleTodos}
            onChangeFilter={setActiveFilter}
            activeFilter={activeFilter}
            onClearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          message={errorMessage}
        />
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Notification } from './components/Notification';
import { Error } from './types/Error';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import {
  GetId,
  Submit,
  GetValue,
  GetTodoAndTitle,
  GetTodo,
} from './types/functions';

const USER_ID = 6994;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.None);
  const [status, setStatus] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIDs, setDeletingTodoIDs] = useState<number[]>([]);
  const [tempIds, setTempIds] = useState<number[]>([]);
  const [tempId, setTempId] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch {
        setError(Error.Get);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setError(Error.None), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  const isCompletedTodos = useMemo(
    () => todos.every(({ completed }) => completed),
    [todos],
  );

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (status) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [status, todos]);

  const createTodo:Submit = useCallback(async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError(Error.Empty);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const todo = await addTodo(newTodo);

      setTodos((oldTodos) => [...oldTodos, todo]);
      setQuery('');
    } catch {
      setError(Error.Add);
    } finally {
      setTempTodo(null);
    }
  }, [query]);

  const removeTodo:GetId = useCallback(async (id) => {
    setDeletingTodoIDs(prevIds => [...prevIds, id]);

    try {
      await deleteTodo(id);

      setTodos(
        (oldTodos => oldTodos.filter(todo => todo.id !== id)),
      );
    } catch {
      setTempId(0);
      setError(Error.Delete);
    } finally {
      setDeletingTodoIDs(prevIds => prevIds.filter(item => item !== id));
    }
  }, []);

  const clearCompleted = useCallback(() => {
    setDeletingTodoIDs(completedTodos.map(({ id }) => id));

    completedTodos.forEach(todo => removeTodo(todo.id));
  },
  [completedTodos]);

  const renameTodo:GetId = id => setTempId(id);

  const onChange:GetValue = useCallback(value => setQuery(value), [query]);

  const completeTodo:GetTodo = async (currentTodo) => {
    const { id, completed } = currentTodo;

    setTempIds(prevIds => [...prevIds, id]);

    try {
      await updateTodo(id, { ...currentTodo, completed: !completed });

      setTodos(oldTodos => oldTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      }));
    } catch {
      setError(Error.Update);
    } finally {
      setTempIds([]);
    }
  };

  const updateTitle:GetTodoAndTitle = async (currentTodo, editTitle) => {
    const { id, title } = currentTodo;

    if (title === editTitle) {
      setTempId(0);

      return;
    }

    setTempId(0);
    setTempIds([id]);

    try {
      await updateTodo(id, { ...currentTodo, title });

      setTodos(oldTodos => oldTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, title: editTitle };
        }

        return todo;
      }));
    } catch {
      setError(Error.Update);
    } finally {
      setTempIds([]);
    }
  };

  const toggleAll = () => {
    if (isCompletedTodos) {
      todos.forEach(todo => completeTodo(todo));

      return;
    }

    const activeTodos = todos.filter(todo => !todo.completed);

    activeTodos.forEach(todo => completeTodo(todo));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          hasTodos={!!todos.length}
          isDisabledField={!!tempTodo}
          isActiveButton={isCompletedTodos}
          onToggle={toggleAll}
          onSubmit={createTodo}
          onChange={onChange}
        />

        <section className="todoapp__main">
          <TodoList
            tempId={tempId}
            tempIds={tempIds}
            tempTodo={tempTodo}
            todos={visibleTodos}
            deletingTodoIDs={deletingTodoIDs}
            setTempId={setTempId}
            removeTodo={removeTodo}
            completeTodo={completeTodo}
            renameTodo={renameTodo}
            updateTitle={updateTitle}
          />
        </section>

        {!!todos.length && (
          <Footer
            status={status}
            todos={todos}
            setStatus={setStatus}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <Notification error={error} setError={setError} />
    </div>
  );
};

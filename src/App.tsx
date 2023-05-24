/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { TodoList } from './Components/TodoList/TodoList';
import { Status } from './types/TodoFilter';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { NewError } from './types/ErrorsList';
import { USER_ID } from './consfig';
import { Title } from './Components/Title/Title';
import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';
import { Error } from './Components/Error/Error';

export const App: FC = memo(() => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [visibleError, setVisibleError] = useState<NewError | null>(null);
  const [isRemovingCompleted, setIsRemovingCompleted] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isUpdatingEveryStatus, setIsUpdatingEveryStatus] = useState(false);

  const visibleTodos = useMemo(() => (
    todos.filter((todo) => {
      switch (filterBy) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return true;
      }
    })
  ), [todos, filterBy]);

  const loadTodo = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
  }, []);

  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const isTodosNoEmpty = todos.length > 0;
  const isEveryTotoCompleted = todos.every((todo) => todo.completed);

  const handleFilterChange = useCallback((newFilter: Status) => {
    setFilterBy(newFilter);
  }, []);

  const handleSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (query.trim() === '') {
      setVisibleError(NewError.Title);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch (error) {
      setVisibleError(NewError.Add);
    } finally {
      setTempTodo(null);
    }

    setQuery('');
  }, [query]);

  const handleCloseError = useCallback(() => {
    setVisibleError(null);
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    try {
      await client.delete(`/todos/${todoId}`);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    } catch (error) {
      setVisibleError(NewError.Remove);
    }
  }, []);

  const handleRemoveCompletedTodos = useCallback(async () => {
    setIsRemovingCompleted(true);

    try {
      await Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => deleteTodo(todo.id)),
      );

      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch (error) {
      setVisibleError(NewError.Remove);
    } finally {
      setIsRemovingCompleted(false);
    }
  }, [todos]);

  const handleUpdateTodo = useCallback(async (todoToUptade: Todo) => {
    setUpdatingTodoId(todoToUptade.id);
    const updatedTodo = {
      ...todoToUptade,
      completed: !todoToUptade.completed,
    };

    try {
      await updateTodo(updatedTodo);

      setTodos((prevTodos) => prevTodos.map((todo) => (
        todo.id === todoToUptade.id ? updatedTodo : todo
      )));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setUpdatingTodoId(null);
    }
  }, [todos]);

  const handleUpdateAllTodos = useCallback(async () => {
    setIsUpdatingEveryStatus(true);
    try {
      await Promise.all(
        todos.map((todo) => updateTodo({
          ...todo,
          completed: !isEveryTotoCompleted,
        })),
      );

      setTodos((prevTodos) => prevTodos.map((todo) => ({
        ...todo,
        completed: !isEveryTotoCompleted,
      })));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setIsUpdatingEveryStatus(false);
    }
  }, [todos]);

  const handleUpdateTodoTitle = useCallback(async (
    todoToUpdate: Todo,
    newTitle: string,
  ) => {
    setUpdatingTodoId(todoToUpdate.id);

    try {
      const updatedTodo = await updateTodo({
        ...todoToUpdate,
        title: newTitle,
      });

      setTodos((prevTodos) => prevTodos.map((todo) => (
        todo.id === todoToUpdate.id ? updatedTodo : todo
      )));
    } catch (error) {
      setVisibleError(NewError.Update);
    } finally {
      setUpdatingTodoId(null);
    }
  }, [todos]);

  useEffect(() => {
    loadTodo();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisibleError(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [visibleError]);

  return (
    <div className="todoapp">
      <Title />

      <div className="todoapp__content">
        <Header
          isTodosNoEmpty={isTodosNoEmpty}
          isEveryTotoCompleted={isEveryTotoCompleted}
          onUpdateAllTodos={handleUpdateAllTodos}
          onSubmit={handleSubmit}
          query={query}
          setQuery={setQuery}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          updatingTodoId={updatingTodoId}
          isRemovingCompleted={isRemovingCompleted}
          isUpdatingStatus={isUpdatingEveryStatus}
          isAllTotoCompleted={isEveryTotoCompleted}
          onRemove={handleRemoveTodo}
          onUpdate={handleUpdateTodo}
          onTitleUpdate={handleUpdateTodoTitle}
        />

        {isTodosNoEmpty && (
          <Footer
            itemsLeft={itemsLeft}
            filterBy={filterBy}
            onRemoveCompletedTodos={handleRemoveCompletedTodos}
            onFilterChange={handleFilterChange}
          />
        )}

        <Error
          visibleError={visibleError}
          onCloseError={handleCloseError}
        />
      </div>
    </div>
  );
});

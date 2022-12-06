import React, {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  postTodo,
  patchTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Filter } from './types/Filter';
import { Errors } from './types/Errors';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [seenTodos, setSeenTodos] = useState(todos);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isError, setIsError] = useState<Error>({
    message: Errors.NONE,
    status: false,
  });

  const [query, setQuery] = useState('');
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [isTodoOnLoad, setIsTodoOnLoad] = useState(false);
  const [pickedTodoIds, setPickedTodoIds] = useState<number[]>([]);

  const [todoIdToChange, setTodoIdToChange] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const errorNotification = useCallback((text: Errors) => {
    setIsError({ message: text, status: true });

    setTimeout(() => {
      setIsError({
        message: text,
        status: false,
      });
    }, 3000);
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      if (user) {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      }
    } catch (error) {
      errorNotification(Errors.LOAD);
    }
  }, [user]);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    fetchTodos();
  }, []);

  useEffect(() => {
    let todosToFilter = [...todos];

    if (filter !== 'All') {
      todosToFilter = todosToFilter.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    setSeenTodos(todosToFilter);
  }, [todos, filter]);

  function getRandomId(max: number): number {
    return Math.floor(Math.random() * max);
  }

  const addTodo = async (title: string) => {
    try {
      if (user) {
        const todoToAdd: Todo = {
          id: getRandomId(10000),
          userId: user.id,
          title,
          completed: false,
        };

        setQuery('');
        setNewTodo(todoToAdd);

        await postTodo(todoToAdd);
        setTodos([...todos, todoToAdd]);
      }
    } catch (error) {
      errorNotification(Errors.ADD);
    }
  };

  const handleTodoCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsError({
      message: Errors.NONE,
      status: false,
    });

    try {
      if (!query.trim()) {
        errorNotification(Errors.TITLE);
      } else {
        setIsTodoOnLoad(true);
        await addTodo(query);
        setIsTodoOnLoad(false);
        setNewTodo(null);
      }
    } catch (error) {
      errorNotification(Errors.ADD);
    }
  };

  const handleFilter = useCallback(
    (todosFilter: Filter) => setFilter(todosFilter), [todos],
  );

  const handleErrorClose = useCallback(() => setIsError({
    message: Errors.NONE,
    status: false,
  }), []);

  const handleTodoToggle = async (id: number, completed: boolean) => {
    try {
      const todoToChange = todos.find(todo => todo.id === id);

      // that if statement should check the handleAllStatus is pushed massive setPickedTodoIds() state but it doesnt, halp pls
      if (pickedTodoIds.length <= 1) {
        setPickedTodoIds([id]);
      }

      await patchTodo(id, { completed: !completed });
      (todoToChange as Todo).completed = !completed;
    } catch (error) {
      errorNotification(Errors.UPDATE);
    } finally {
      setPickedTodoIds([]);
    }
  };

  const handleAllStatus = async () => {
    try {
      if (user) {
        const undoneTodos = todos.filter(todo => !todo.completed);

        if (undoneTodos.length === 0) {
          setPickedTodoIds(todos.map(todo => todo.id));

          todos.map(async ({ id, completed }) => {
            await handleTodoToggle(id, completed);
          });

          return;
        }

        setPickedTodoIds(undoneTodos.map(todo => todo.id));

        await Promise.all(undoneTodos.map(async ({ id, completed }) => {
          await handleTodoToggle(id, completed);
        }));
      }
    } catch (error) {
      errorNotification(Errors.DELETE);
    } finally {
      setPickedTodoIds([]);
    }
  };

  const todoDeleting = async (id: number) => {
    try {
      setPickedTodoIds([id]);

      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      errorNotification(Errors.DELETE);
    } finally {
      setPickedTodoIds([]);
    }
  };

  const handleOnKeyDown
  = async (event: KeyboardEvent<HTMLInputElement>) => {
    const changedTodo: Todo | undefined = todos
      .find(todo => todo.id === todoIdToChange);

    try {
      if (event.key === 'Escape') {
        setTodoIdToChange(null);
      }

      if (event.key === 'Enter') {
        event.preventDefault();

        const todoValue: string | undefined = changedTodo
          && (event.target as HTMLInputElement).value;

        if (!todoValue) {
          deleteTodo(todoIdToChange as number);
          setTodos(todos.filter(todo => todo.id !== todoIdToChange));

          return;
        }

        if (changedTodo?.title === todoValue) {
          setTodoIdToChange(null);

          return;
        }

        setPickedTodoIds([todoIdToChange as number]);

        await patchTodo(todoIdToChange as number, { title: newTitle });
        (changedTodo as Todo).title = todoValue;

        setTodoIdToChange(null);
      }
    } catch (error) {
      errorNotification(Errors.UPDATE);
    } finally {
      setPickedTodoIds([]);
    }
  };

  const handleClearCompleted = async () => {
    try {
      if (user) {
        const completedTodos = todos.filter(todo => todo.completed);

        setPickedTodoIds(completedTodos.map(todo => todo.id));

        await Promise.all(completedTodos.map(async ({ id }) => {
          await deleteTodo(id);
        }));

        setTodos(todos.filter(todo => !todo.completed));
      }
    } catch (error) {
      errorNotification(Errors.DELETE);
    } finally {
      setPickedTodoIds([]);
    }
  };

  const handleBlur = async () => {
    const changedTodo = todos
      .find(todo => todo.id === todoIdToChange);

    try {
      setPickedTodoIds([todoIdToChange as number]);

      if (!newTitle) {
        deleteTodo(todoIdToChange as number);
        setTodos(todos.filter(todo => todo.id !== todoIdToChange));

        return;
      }

      if (newTitle === (changedTodo as Todo).title) {
        setTodoIdToChange(null);

        return;
      }

      await patchTodo(todoIdToChange as number, { title: newTitle });
      (changedTodo as Todo).title = newTitle;

      setTodoIdToChange(null);
    } catch (error) {
      errorNotification(Errors.UPDATE);
    } finally {
      setNewTitle('');
      setPickedTodoIds([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          todos={todos}
          query={query}
          handleTodoCreate={handleTodoCreate}
          setQuery={setQuery}
          isTodoOnLoad={isTodoOnLoad}
          allStatus={handleAllStatus}

        />

        <TodoList
          todos={seenTodos}
          newTodo={newTodo}
          isTodoOnLoad={isTodoOnLoad}
          onDelete={todoDeleting}
          pickedTodoId={pickedTodoIds}
          handleTodoToggle={handleTodoToggle}
          handleBlur={handleBlur}
          setTodoIdToChange={setTodoIdToChange}
          setNewTitle={setNewTitle}
          newTitle={newTitle}
          todoIdToChange={todoIdToChange}
          handleOnKeyDown={handleOnKeyDown}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            handleFilter={handleFilter}
            filter={filter}
            completedDelete={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotifications
        isError={isError}
        handleErrorClose={handleErrorClose}
      />
    </div>
  );
};

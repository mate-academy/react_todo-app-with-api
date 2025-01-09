/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  addTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Error } from './components/ErrorMessage/ErrorMessage';

export enum SortBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isLoadingChange, setIsLoadingChange] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<number[] | null>(null);

  const [sortBy, setSortBy] = useState<SortBy>(SortBy.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deleteTodoId, setDeleteTodoId] = useState<number | null>(null);
  const [cleanCompleted, setCleanCompleted] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getTodosFromServer() {
      try {
        const todosFromServer = await getTodos();

        setTodos(todosFromServer);
        setErrorMessage(null);
      } catch {
        setErrorMessage('Unable to load todos');
      }
    }

    getTodosFromServer();
  }, []);

  const itemsLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const handleFilter = useCallback(
    (sort: SortBy, tasks: Todo[] = todos) => {
      switch (sort) {
        case SortBy.All:
          return tasks;
        case SortBy.Active:
          return tasks.filter(todo => !todo.completed);
        case SortBy.Completed:
          return tasks.filter(todo => todo.completed);
      }
    },
    [todos],
  );

  const filteredTodos: Todo[] = useMemo(
    () => handleFilter(sortBy, todos),
    [sortBy, todos, handleFilter],
  );

  function handleUpdateTodoStatus(id: number) {
    const todo = todos.find(currentTodo => currentTodo.id === id);

    if (!todo) {
      return;
    }

    const updatedStatus = { completed: !todo.completed };

    if (updatedStatus) {
      setIsUpdating([id]);
      setErrorMessage(null);

      updateTodo(id, updatedStatus)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.map(item =>
              item.id === id
                ? { ...item, completed: updatedStatus.completed }
                : item,
            ),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to update a todo');
        })
        .finally(() => {
          setIsUpdating(null);
        });
    }
  }

  function handleUpdateAllTodosStatus() {
    const hasUncompleteTodo = todos.findIndex(todo => !todo.completed);

    if (hasUncompleteTodo >= 0) {
      const updatedStatus = { completed: true };

      const updateTodos = async () => {
        const updatedTodos = todos.map(async todo => {
          if (!todo.completed) {
            setIsUpdating(prev =>
              prev === null ? [todo.id] : [...prev, todo.id],
            );
            setErrorMessage(null);

            try {
              await updateTodo(todo.id, updatedStatus);

              return { id: todo.id, status: 'fulfilled' };
            } catch {
              setErrorMessage('Unable to update a todo');

              return { id: todo.id, status: 'rejected' };
            }
          }

          return { id: todo.id, status: 'skipped' };
        });

        const results = await Promise.allSettled(updatedTodos);

        const successfulUpdated = results
          .filter(
            result =>
              result.status === 'fulfilled' &&
              result.value.status === 'fulfilled',
          )
          .map(
            result =>
              (result as PromiseFulfilledResult<{ id: number; status: string }>)
                .value.id,
          );

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            successfulUpdated.includes(todo.id)
              ? { ...todo, completed: true }
              : todo,
          ),
        );

        setIsUpdating(null);
      };

      updateTodos();
    }

    if (hasUncompleteTodo < 0) {
      const updatedStatus = { completed: false };

      const updateTodos = async () => {
        const updatedTodos = todos.map(async todo => {
          setIsUpdating(prev =>
            prev === null ? [todo.id] : [...prev, todo.id],
          );
          setErrorMessage(null);

          try {
            await updateTodo(todo.id, updatedStatus);

            return { id: todo.id, status: 'fulfilled' };
          } catch {
            setErrorMessage('Unable to update a todo');

            return { id: todo.id, status: 'rejected' };
          }
        });

        const results = await Promise.allSettled(updatedTodos);

        const successfulUpdated = results
          .filter(
            result =>
              result.status === 'fulfilled' &&
              result.value.status === 'fulfilled',
          )
          .map(
            result =>
              (result as PromiseFulfilledResult<{ id: number; status: string }>)
                .value.id,
          );

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            successfulUpdated.includes(todo.id)
              ? { ...todo, completed: false }
              : todo,
          ),
        );

        setIsUpdating(null);
      };

      updateTodos();
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim() !== '') {
      setNewTask(query);
      setIsSubmiting(true);
    } else {
      setErrorMessage('Title should not be empty');
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  useEffect(() => {
    if (tempTodo === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo, todos.length]);

  useEffect(() => {
    if (newTask.trim() !== '') {
      const todo: Omit<Todo, 'id'> = {
        userId: USER_ID,
        title: newTask.trim(),
        completed: false,
      };

      if (sortBy !== SortBy.Completed) {
        setTempTodo({ id: 0, ...todo });
      }

      addTodo(todo)
        .then(receivedTodo => {
          setTempTodo(null);
          setQuery('');
          setTodos(currentTodos => [...currentTodos, receivedTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsSubmiting(false);
          setNewTask('');
        });
    } else {
      setIsSubmiting(false);
    }
  }, [newTask, sortBy]);

  useEffect(() => {
    let timerEmpty: NodeJS.Timeout;

    if (errorMessage) {
      timerEmpty = setTimeout(() => setErrorMessage(null), 3000);
    }

    return () => clearTimeout(timerEmpty);
  }, [errorMessage]);

  useEffect(() => {
    async function deleteTodoFromServer() {
      if (deleteTodoId !== null) {
        setIsLoadingChange(true);

        try {
          await deleteTodo(deleteTodoId).then(() => {
            const newTodos = todos.filter(todo => todo.id !== deleteTodoId);

            setTodos(newTodos);
          });
        } catch {
          setErrorMessage('Unable to delete a todo');
        } finally {
          setIsLoadingChange(false);
          setDeleteTodoId(null);
        }
      }
    }

    const cleanup = deleteTodoFromServer();

    return () => {
      if (cleanup instanceof Function) {
        cleanup();
      }
    };
  }, [deleteTodoId, todos]);

  useEffect(() => {
    async function deleteTodoFromServer() {
      if (cleanCompleted) {
        setIsLoadingChange(true);

        const completedTodos = todos.filter(todo => todo.completed);
        const deletionPromises = completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);

            return { id: todo.id, status: 'fulfilled' };
          } catch (error) {
            setErrorMessage('Unable to delete a todo');

            return { id: todo.id, status: 'rejected' };
          }
        });

        const resolvedDeletions = await Promise.allSettled(deletionPromises);

        const successfulDeletions = resolvedDeletions
          .filter(
            date =>
              date.status === 'fulfilled' && date.value.status === 'fulfilled',
          )
          .map(
            date =>
              (date as PromiseFulfilledResult<{ id: number; status: string }>)
                .value.id,
          );

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfulDeletions.includes(todo.id)),
        );
      }

      setIsLoadingChange(false);
      setCleanCompleted(false);
    }

    deleteTodoFromServer();
  }, [cleanCompleted, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          query={query}
          onInput={handleInput}
          onSubmit={handleSubmit}
          isSubmiting={isSubmiting}
          inputRef={inputRef}
          onUpdateAllTodos={handleUpdateAllTodosStatus}
          itemsLeft={itemsLeft}
          todosLength={todos.length}
        />

        <TodoList
          onDeleteTodo={setDeleteTodoId}
          todos={filteredTodos}
          isLoadingChange={isLoadingChange}
          deleteTodoId={deleteTodoId}
          cleanCompleted={cleanCompleted}
          tempTodo={tempTodo}
          onUpdateTodo={handleUpdateTodoStatus}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setDeleteTodoId={setDeleteTodoId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            sortBy={sortBy}
            onSortBy={setSortBy}
            onCleanCompleted={setCleanCompleted}
            todosLength={todos.length}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error errorMessage={errorMessage} onErrorMessage={setErrorMessage} />
    </div>
  );
};

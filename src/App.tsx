/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo as addTodoApi,
  deleteTodo as deleteTodoApi,
  updateTodo as updateTodoApi,
  getTodos,
  USER_ID,
} from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
/* eslint-disable-next-line max-len */
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { Filter } from './types/Filter';
import { Loader } from './components/Loader/Loader';
import { HeaderHandle } from './types/HeaderHandle';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitLoaderVisible, setIsInitLoaderVisible] = useState(false);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([]);

  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isLoaderShown = false;

    const timer = setTimeout(() => {
      setIsInitLoaderVisible(true);
      isLoaderShown = true;
    }, 500);

    getTodos()
      .then(todos => {
        setAllTodos(todos);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        clearTimeout(timer);
        if (isLoaderShown) {
          setTimeout(() => {
            setIsInitLoaderVisible(false);
          }, 500);
        }
      });
  }, []);

  const headerRef = useRef<HeaderHandle>(null);

  const filteredTodos: Todo[] = useMemo(() => {
    switch (filter) {
      case 'All':
        return allTodos;
      case 'Completed':
        return allTodos.filter(todo => todo.completed);
      case 'Active':
        return allTodos.filter(todo => !todo.completed);
    }
  }, [filter, allTodos]);

  const activeCount = useMemo(() => {
    return allTodos.reduce(
      (accCount, todo) => (todo.completed ? accCount : accCount + 1),
      0,
    );
  }, [allTodos]);

  const setError = useCallback((error: string) => {
    setErrorMessage(error);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setErrorMessage('');
      errorTimeoutRef.current = null;
    }, 3000);
  }, []);

  const addNewTodo = useCallback(
    (title: string) => {
      setError('');
      const trimmed = title.trim();

      if (!trimmed) {
        setError('Title should not be empty');

        return new Promise<void>(reject => {
          reject();
        });
      }

      const newTodo: Omit<Todo, 'id'> = {
        title: trimmed,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({ ...newTodo, id: 0 });

      return addTodoApi(newTodo)
        .then(addedTodo => {
          setAllTodos(prevList => [...prevList, addedTodo]);
        })
        .catch(error => {
          setError('Unable to add a todo');
          throw error;
        })
        .finally(() => {
          setTempTodo(null);
          headerRef.current?.focusInput();
        });
    },
    [setError],
  );

  const deleteTodo = useCallback(
    (todoId: number) => {
      setError('');
      setLoadingTodosId(prevList =>
        prevList.includes(todoId) ? prevList : [...prevList, todoId],
      );

      return deleteTodoApi(todoId)
        .then(() => {
          setAllTodos(prevList => prevList.filter(todo => todo.id !== todoId));
        })
        .catch(error => {
          setError('Unable to delete a todo');
          throw error;
        })
        .finally(() =>
          setLoadingTodosId(prevList =>
            prevList.filter(currentId => currentId !== todoId),
          ),
        );
    },
    [setError],
  );

  const focusHeaderInput = useCallback(
    () => headerRef.current?.focusInput(),
    [],
  );

  const updateTodo = useCallback(
    (updatedTodo: Todo) => {
      const updatedTitleTrimmed = updatedTodo.title.trim();

      if (updatedTitleTrimmed.length === 0) {
        return deleteTodo(updatedTodo.id);
      }

      setLoadingTodosId(prevList =>
        prevList.includes(updatedTodo.id)
          ? prevList
          : [...prevList, updatedTodo.id],
      );

      const originalTodo = allTodos.find(todo => todo.id === updatedTodo.id);

      if (
        originalTodo &&
        originalTodo.title === updatedTitleTrimmed &&
        originalTodo.completed === updatedTodo.completed
      ) {
        return Promise.resolve().finally(() =>
          setLoadingTodosId(prevList =>
            prevList.filter(currentId => currentId !== updatedTodo.id),
          ),
        );
      }

      const updatedTodoTrimmed: Todo = {
        ...updatedTodo,
        title: updatedTitleTrimmed,
      };

      return updateTodoApi(updatedTodo)
        .then(() => {
          setAllTodos(prevList =>
            prevList.map(todo =>
              todo.id === updatedTodo.id ? updatedTodoTrimmed : todo,
            ),
          );
        })
        .catch(error => {
          setError('Unable to update a todo');
          throw error;
        })
        .finally(() =>
          setLoadingTodosId(prevList =>
            prevList.filter(currentId => currentId !== updatedTodo.id),
          ),
        );
    },
    [allTodos, deleteTodo, setError],
  );

  const toggleAllComplete = useCallback(
    (allCompleted: boolean) => {
      return Promise.all(
        allTodos.map(todo => {
          updateTodo({ ...todo, completed: !allCompleted });
        }),
      );
    },
    [allTodos, updateTodo],
  );

  const toggleOneComplete = useCallback(
    (todo: Todo) => {
      return updateTodo({ ...todo, completed: !todo.completed });
    },
    [updateTodo],
  );

  const deleteCompleted = useCallback(() => {
    setLoadingTodosId(prevList => {
      const completedTodosId = allTodos
        .filter(todo => todo.completed && !prevList.includes(todo.id))
        .map(todo => todo.id);

      return completedTodosId;
    });

    return Promise.all(
      allTodos.filter(todo => todo.completed).map(todo => deleteTodo(todo.id)),
    ).finally(() => focusHeaderInput());
  }, [allTodos, deleteTodo, focusHeaderInput]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={headerRef}
          isAllCompleted={activeCount === 0}
          onAdd={addNewTodo}
          toggleComplete={toggleAllComplete}
          doTodosExist={allTodos.length !== 0}
        />
        {isInitLoaderVisible ? (
          <Loader />
        ) : (
          <TodoList
            todos={filteredTodos}
            toggleComplete={toggleOneComplete}
            onDelete={deleteTodo}
            tempTodo={tempTodo}
            onEdit={updateTodo}
            focusHeaderInput={focusHeaderInput}
            loadingTodosId={loadingTodosId}
          />
        )}

        {allTodos.length !== 0 && !isInitLoaderVisible && (
          <Footer
            onFilter={setFilter}
            currentFilter={filter}
            activeCount={activeCount}
            doesCompletedExist={activeCount < allTodos.length}
            clearCompleted={deleteCompleted}
          />
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} onError={setError} />
    </div>
  );
};

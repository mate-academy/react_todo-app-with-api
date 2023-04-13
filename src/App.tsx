import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ToodList } from './components/TodoList/TodoList';
import {
  getTodos,
  postTodo,
  deleteTodo, patchTodo,
} from './api/todos';
import { Loader } from './components/Loader';
import { FilterType } from './types/FilterEnum';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer';

const USER_ID = 7006;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [temporaryTodo, setTemporaryTodo] = useState<Todo>();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterType.All);

  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        setErrorMessage('');
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    getTodosFromServer();
  }, []);

  const addTodo = (todoTitle: string) => {
    const newTodo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsInputDisabled(true);

    setTemporaryTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then(result => {
        setTodos(state => [...state, result]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTemporaryTodo(undefined);
      });
  };

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Tittle cannot be empty');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    addTodo(title);
    setTitle('');
  }, [title]);

  const removeTodo = useCallback(async (id: number) => {
    setLoadingIds(state => [...state, id]);
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingIds(state_1 => state_1.filter(el => el !== id));
    }
  }, [todos]);

  const activeTodos = useMemo(() => {
    return todos.filter(({ completed }) => !completed).length;
  }, [todos]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    }, [title],
  );

  const removeError = () => {
    setErrorMessage('');
  };

  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    setLoadingIds(state => [...state, id]);

    try {
      await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
    }
  };

  const toggleAllCompleted = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);

    if (allCompleted) {
      todos.map(todoEl => {
        return handleUpdate(todoEl.id, { completed: false });
      });
    } else {
      const notCompleted = todos.filter(el => !el.completed);

      notCompleted.map(todoElement => {
        return handleUpdate(todoElement.id, { completed: true });
      });
    }
  }, [todos]);

  const removeCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(async todo => {
      try {
        await deleteTodo(todo.id);
        setTodos(todos.filter(task => !task.completed));
      } catch {
        setErrorMessage('Unable to remove todo');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    });
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {isLoading && (
        <Loader />
      )}

      <Header
        onChangeTitle={handleInputChange}
        onSubmitForm={handleFormSubmit}
        isInputDisabled={isInputDisabled}
        onToggleAllCompleted={toggleAllCompleted}
        title={title}
      />

      <div className="todoapp__content">
        {todos.length > 0 && (
          <>
            <ToodList
              temporaryTodo={temporaryTodo}
              onDeleteTodo={removeTodo}
              onUpdateTodo={handleUpdate}
              loadingIds={loadingIds}
              todos={todos}
              filter={selectedFilter}
            />

            <Footer
              activeTodos={activeTodos}
              selectedFilter={selectedFilter}
              onSelectFilter={setSelectedFilter}
              completedTodos={todos.length - activeTodos}
              onDeleteComplete={removeCompletedTodos}
            />
          </>
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        onDelete={removeError}
      />
    </div>
  );
};

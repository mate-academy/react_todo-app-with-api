import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { ToodoList } from './components/TodoList/TodoList';
import {
  getTodos,
  postTodo,
  deleteTodo,
  patchTodo,
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
  const [isAllCompleted, setIsAllCompleted] = useState(false);

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

  const clearErrorMessage = () => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const addTodo = async (todoTitle: string) => {
    const newTodo = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setIsInputDisabled(true);

    setTemporaryTodo({ ...newTodo, id: 0 });

    try {
      const result = await postTodo(newTodo);

      setTodos(state => [...state, result]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      clearErrorMessage();
    } finally {
      setIsInputDisabled(false);
      setTemporaryTodo(undefined);
    }
  };

  const handleFormSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Tittle cannot be empty');
      clearErrorMessage();

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
      clearErrorMessage();
    } finally {
      setLoadingIds(state => state.filter(el => el !== id));
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
      const updatedTodo = await patchTodo(id, data);

      setTodos(state => state.map(todo => {
        if (todo.id === id) {
          return updatedTodo;
        }

        return todo;
      }));
    } catch {
      setErrorMessage('Unable to update the todo');
      clearErrorMessage();
    } finally {
      setLoadingIds(state => state.filter(loadId => loadId !== id));
    }
  };

  const toggleAllCompleted = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);

    setIsAllCompleted((prevState) => !prevState);

    if (allCompleted) {
      todos.forEach(todoEl => {
        return handleUpdate(todoEl.id, { completed: false });
      });
    } else {
      const notCompleted = todos.filter(todo => !todo.completed);

      notCompleted.map(todoElement => {
        return handleUpdate(todoElement.id, { completed: true });
      });
    }
  }, [todos]);

  const removeCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(async todo => {
      setLoadingIds(completedTodos.map(activeTodo => activeTodo.id));
      try {
        await deleteTodo(todo.id);
      } catch {
        setErrorMessage('Unable to remove todo');
        clearErrorMessage();
      }
    })).then(() => {
      setTodos(todos.filter(task => !task.completed));
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
        isAllCompleted={isAllCompleted}
        title={title}
      />

      <div className="todoapp__content">
        {todos.length > 0 && (
          <>
            <ToodoList
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

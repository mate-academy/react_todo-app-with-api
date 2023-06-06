/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { Todo } from './types/Todo';

import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Status, ErrorType } from './enums/enums';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodosList } from './components/TodosList/TodosList';
import { Error } from './components/Error/Error';
import { Context } from './context';

const USER_ID = 10326;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Error Data
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorNotification, setIsErrorNotification] = useState(false);
  const isError = errorType !== ErrorType.None;
  const setError = useCallback((typeOfError: ErrorType) => {
    setErrorType(typeOfError);
    setTimeout(() => setErrorType(ErrorType.None), 3000);
  }, [ErrorType]);

  const errorMessage = useMemo(() => {
    switch (errorType) {
      case ErrorType.Add:
        return 'Unable to add a todo';

      case ErrorType.EmptyTitle:
        return 'Title can\'t be empty';

      case ErrorType.Delete:
        return 'Unable to delete a todo';

      case ErrorType.Update:
        return 'Unable to update a todo';

      default:
        return 'Something wrong';
    }
  }, [errorType]);

  // Header Data && Add Todo
  const todosCompleted = useMemo(() => todos
    .filter(todo => todo.completed), [todos]);
  const isActive = todosCompleted.length === todos.length;
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // Add Todo
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const onAdd = async (event: React.FormEvent) => {
    event.preventDefault();

    setSelectedTodoId(null);
    setError(ErrorType.None);

    if (newTodoTitle.trim() === '') {
      setError(ErrorType.EmptyTitle);

      return;
    }

    try {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: '',
        completed: false,
      });

      const responce = await addTodo(USER_ID, newTodoTitle);

      setTodos((prev) => [...prev, responce]);
    } catch {
      setError(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setNewTodoTitle('');
    }
  };

  // Delete Todo
  const onDelete = async (id: number) => {
    setSelectedTodoId(id);
    setIsUpdating(true);
    setError(ErrorType.None);

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setIsUpdating(false);
    }
  };

  const completedTodosId = useMemo(() => {
    return todosCompleted.map(todo => todo.id);
  }, [todos]);
  const [isClearCompletedTodos, setIsClearCompletedTodos] = useState(false);

  const onDeleteCompleted = async () => {
    setIsClearCompletedTodos(true);
    setIsUpdating(true);
    setError(ErrorType.None);
    try {
      await Promise.all(
        completedTodosId.map((id: number) => deleteTodo(id)),
      );
      setTodos((prev) => prev.filter(item => !item.completed));
    } catch (error) {
      setError(ErrorType.Delete);
    } finally {
      setIsClearCompletedTodos(false);
      setIsUpdating(false);
    }
  };

  // Set New Todo Title
  const onTitleChange = async (todoId: number, title: string) => {
    setIsUpdating(true);
    setSelectedTodoId(todoId);
    setError(ErrorType.None);
    const editedTodo = todos.find(todo => todo.id === todoId);

    if (editedTodo) {
      try {
        await updateTodo(editedTodo.id, { title });
        setTodos((prev) => prev.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        }));
      } catch (error) {
        setError(ErrorType.Update);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const onToggleStatus = async (todoId: number, completed: boolean) => {
    setSelectedTodoId(todoId);
    setIsUpdating(true);
    setError(ErrorType.None);
    const editedTodo = todos.find(todo => todo.id === todoId);

    if (editedTodo) {
      try {
        await updateTodo(editedTodo?.id, { completed });
        setTodos((prev) => prev.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed,
            };
          }

          return todo;
        }));
      } catch (error) {
        setError(ErrorType.Update);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const [isToggleAll, setIsToggleAll] = useState(false);

  const onToggleAll = async () => {
    setIsToggleAll(true);
    setError(ErrorType.None);
    try {
      await Promise.all(
        todos.map((todo) => {
          if (todo.completed === false) {
            updateTodo(todo.id, { completed: true });
          }

          if (completedTodosId.length === todos.length) {
            updateTodo(todo.id, { completed: !todo.completed });
          }

          return todo;
        }),
      );

      setTodos((prev) => prev.map((todo) => {
        if (todo.completed === false) {
          return {
            ...todo,
            completed: true,
          };
        }

        if (completedTodosId.length === todos.length) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      }));
    } catch (error) {
      setError(ErrorType.Update);
    } finally {
      setTimeout(() => {
        setIsToggleAll(false);
      }, 300);
    }
  };

  // Get Todos From Server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responce = await getTodos(USER_ID);
        const todosFromServer = responce;

        setError(ErrorType.None);
        setTodos(todosFromServer);
      } catch (error) {
        setError(ErrorType.Add);
        Promise.reject();
      }
    };

    fetchData();
  }, []);

  // Todos Filter Data
  const [status, setStatus] = useState<Status>(Status.All);
  const filterTodos = (filter: Status) => {
    switch (filter) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  // Context Value
  const contextValue = {
    onDelete,
    onAdd,
    onTitleChange,
    onToggleStatus,
  };

  const visibleTodos = filterTodos(status);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <Context.Provider value={contextValue}>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <Header
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
            isActive={isActive}
            isUpdating={isUpdating}
            onToggleAll={onToggleAll}
          />

          {todos.length !== 0 && (
            <>
              <TodosList
                visibleTodos={visibleTodos}
                tempTodo={tempTodo}
                isUpdating={isUpdating}
                selectedTodoId={selectedTodoId}
                completedTodosId={completedTodosId}
                isClearCompletedTodos={isClearCompletedTodos}
                isToggleAll={isToggleAll}
              />

              <Footer
                status={status}
                setStatus={setStatus}
                todos={todos}
                onDeleteCompleted={onDeleteCompleted}
              />
            </>
          )}
        </div>

        <Error
          isError={isError}
          isErrorNotification={isErrorNotification}
          setIsErrorNotification={setIsErrorNotification}
          errorMessage={errorMessage}
        />
      </div>
    </Context.Provider>
  );
};

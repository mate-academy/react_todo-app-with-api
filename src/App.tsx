/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';

import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Notification } from './components/Notification/Notification';
import { ErrorType } from './types/ErrorTypes';

const USER_ID = 10587;

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isUpdating, setIsUpdating] = useState<number[]>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleCloseErrorMessage = () => setErrorMessage('');

  const handleLoadTodos = useCallback(async () => {
    try {
      const todosFromApi = await getTodos(USER_ID);

      setTodos(todosFromApi);
    } catch {
      setErrorMessage(ErrorType.Load);
    } finally {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    handleLoadTodos();
  }, []);

  const completedTodos = useMemo(() => todos.filter(todo => todo.completed), [todos]);
  const activeTodos = useMemo(() => todos.filter(todo => !todo.completed), [todos]);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo: Todo) => {
      switch (filter) {
        case FilterType.Completed:
          return todo.completed;
        case FilterType.Active:
          return !todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const handleNewTodoChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  }, []);

  const addNewTodo = async (event: React.FormEvent) => {
    event.preventDefault();

    setInputDisabled(true);

    if (newTodo.trim() === '') {
      setErrorMessage(ErrorType.EmptyTitle);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    try {
      const userTodo = {
        id: 0,
        userId: USER_ID,
        title: newTodo,
        completed: false,
      };

      setIsUpdating(prev => [...prev, userTodo.id]);
      setTempTodo(userTodo);
      const addedTodo = await addTodo(userTodo);

      setTodos((prev) => [...prev, addedTodo]);
    } catch (err) {
      setErrorMessage(ErrorType.Add);
    } finally {
      setTempTodo(null);
      setNewTodo('');
      setInputDisabled(false);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const onDeleteTodo = async (id: number) => {
    setInputDisabled(true);
    setIsUpdating(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setInputDisabled(false);
      setIsUpdating([]);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const completedTodosId = useMemo(() => completedTodos.map(todo => todo.id), [todos]);

  const handleDeleteCompleted = async () => {
    setInputDisabled(true);

    try {
      await Promise.all(
        completedTodosId.map((id) => onDeleteTodo(id)),
      );
    } catch {
      setErrorMessage(ErrorType.Delete);
    } finally {
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const onToggleStatus = async (id: number, completed: boolean) => {
    setIsUpdating(prev => [...prev, id]);
    setInputDisabled(true);

    const editedTodo = todos.find(todo => todo.id === id);

    if (editedTodo) {
      try {
        await updateTodo(editedTodo?.id, { completed });
        setTodos((prev) => prev.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              completed,
            };
          }

          return todo;
        }));
      } catch (error) {
        setErrorMessage(ErrorType.Update);
      } finally {
        setInputDisabled(false);
        setIsUpdating([]);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  const [isToggleAll, setIsToggleAll] = useState(false);

  const onToggleAll = async () => {
    setIsToggleAll(true);

    try {
      await Promise.all(
        todos.map((todo) => {
          if (!todo.completed) {
            updateTodo(todo.id, { completed: true });
          }

          if (completedTodosId.length === todos.length) {
            updateTodo(todo.id, { completed: !todo.completed });
          }

          return todo;
        }),
      );

      setTodos((prev) => prev.map((todo) => {
        if (!todo.completed) {
          return {
            ...todo,
            completed: true,
          };
        }

        if (completedTodos.length === todos.length) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }

        return todo;
      }));
    } catch (error) {
      setErrorMessage(ErrorType.Update);
    } finally {
      setTimeout(() => {
        setErrorMessage('');
        setIsToggleAll(false);
      }, 3000);
    }
  };

  const onTitleChange = async (id: number, title: string) => {
    setIsUpdating(prev => [...prev, id]);
    setInputDisabled(true);

    const editedTodo = todos.find(todo => todo.id === id);

    if (editedTodo) {
      try {
        await updateTodo(editedTodo?.id, { title });
        setTodos((prev) => prev.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              title,
            };
          }

          return todo;
        }));
      } catch (error) {
        setErrorMessage(ErrorType.Update);
      } finally {
        setInputDisabled(false);
        setIsUpdating([]);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={activeTodos.length > 0}
          newTodo={newTodo}
          setNewTodo={handleNewTodoChange}
          inputDisabled={inputDisabled}
          onNewTodoSubmit={addNewTodo}
          onToggleAll={onToggleAll}
        />

        <TodoList
          visibleTodos={filteredTodos}
          onDeleteTodo={onDeleteTodo}
          isUpdating={isUpdating}
          tempTodo={tempTodo}
          onToggleStatus={onToggleStatus}
          isToggleAll={isToggleAll}
          onTitleChange={onTitleChange}
        />

        {(filteredTodos.length
        || (filteredTodos.length === 0 && filter === FilterType.Completed)) && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todosLength={todos.length}
            hasCompletedTodos={completedTodos.length > 0}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      {errorMessage && (
        <Notification
          errorMessage={errorMessage}
          closeErrorMessage={handleCloseErrorMessage}
        />
      )}
    </div>
  );
};

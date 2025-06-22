/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { TodoFooter } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { Errors, FilterOptions } from './types/enums/Enums';

export const App: React.FC = () => {
  const handleFilteredTodos = (
    todos: Todo[],
    filterSelected: FilterOptions,
  ) => {
    switch (filterSelected) {
      case FilterOptions.active:
        return todos.filter(todo => !todo.completed);
      case FilterOptions.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterSelected, setFilterSelected] = useState<FilterOptions>(
    FilterOptions.all,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const preparedTodos = handleFilteredTodos(todos, filterSelected);
  const activeTodos = handleFilteredTodos(todos, FilterOptions.active);
  const completedTodos = handleFilteredTodos(todos, FilterOptions.completed);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const showError = (error: Errors) => {
    setErrorMessage(error);

    setTimeout(() => {
      clearErrorMessage();
    }, 3000);
  };

  const toggleTodo = async (todoId: number, completed: boolean) => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      const updatedTodo = await updateTodo(todoId, { completed });

      setTodos(current =>
        current.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      showError(Errors.UpdateTodo);
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    const updatedIds = todosToUpdate.map(todo => todo.id);

    setLoadingTodoIds(current => [...current, ...updatedIds]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: newStatus })
        .then(updated => {
          setTodos(current =>
            current.map(currentTodo =>
              currentTodo.id === updated.id ? updated : currentTodo,
            ),
          );
        })
        .catch(() => {
          showError(Errors.UpdateTodo);
        }),
    );

    await Promise.all(updatePromises);

    setLoadingTodoIds(current =>
      current.filter(id => !updatedIds.includes(id)),
    );
  };

  const addNewTodo = async () => {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      showError(Errors.EmptyTitle);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(current => [...current, createdTodo]);
      setNewTitle('');
    } catch {
      showError(Errors.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoIds(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        showError(Errors.DeleteTodo);
      })
      .finally(() => {
        setLoadingTodoIds(current => current.filter(id => id !== todoId));
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(todo => todo.completed);

    if (completed.length === 0) {
      return;
    }

    completed.forEach(todo => {
      setLoadingTodoIds(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          showError(Errors.DeleteTodo);
        })
        .finally(() => {
          setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
        });
    });
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (loadingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [loadingTodoIds]);

  useEffect(() => {
    clearErrorMessage();
    getTodos()
      .then(setTodos)
      .catch(() => showError(Errors.LoadTodos))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renameTodo = async (todoId: number, title: string): Promise<boolean> => {
    setLoadingTodoIds(current => [...current, todoId]);

    try {
      const updated = await updateTodo(todoId, { title });

      setTodos(current =>
        current.map(todo => (todo.id === todoId ? updated : todo)),
      );

      return true;
    } catch {
      showError(Errors.UpdateTodo);

      return false;
    } finally {
      setLoadingTodoIds(current => current.filter(id => id !== todoId));
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
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          addNewTodo={addNewTodo}
          tempTodo={tempTodo}
          inputRef={inputRef}
          handleToggleAll={handleToggleAll}
          todos={todos}
          isLoading={isLoading}
        />

        <TodoList
          todos={tempTodo ? [...preparedTodos, tempTodo] : preparedTodos}
          toggleTodo={toggleTodo}
          deleteTodo={handleDeleteTodo}
          loadingTodoIds={loadingTodoIds}
          renameTodo={renameTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        clearErrorMessage={clearErrorMessage}
      />
    </div>
  );
};

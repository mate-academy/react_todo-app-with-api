import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as clientData from './api/todos';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { Todo, Error, FilterBy } from './types/index';
import { ErrorNotification } from './components/Error/ErrorNotification';
import { TodoItem } from './components/TempTodoItem/TempTodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterTodo, setFilterTodo] = useState<FilterBy>(FilterBy.ALL);

  const [errorMessage, setErrorMessage] = useState<Error>(Error.NO_ERROR);

  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [loadingTodo, setLoadingTodo] = useState<number[]>([]);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [newTitleTodo, setNewTitleTodo] = useState('');

  const catchErrors = (errorMessageForCatch: Error) => {
    setErrorMessage(errorMessageForCatch);
    setTimeout(() => setErrorMessage(Error.NO_ERROR), 3000);
  };

  const clearError = () => setErrorMessage(Error.NO_ERROR);

  function getClientData() {
    setIsLoadingAll(true);

    clientData
      .getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        catchErrors(Error.LOAD);
      })
      .finally(() => setIsLoadingAll(false));
  }

  useEffect(getClientData, []);

  function addTodo(newTitle: string) {
    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      catchErrors(Error.TITLE);

      return;
    }

    const tempNewTodo: Todo = {
      id: 0,
      userId: clientData.USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(tempNewTodo);
    setIsInputDisabled(true);
    setLoadingTodo((prev: number[]) => [...prev, clientData.USER_ID]);
    clearError();

    clientData
      .addTodos({
        userId: clientData.USER_ID,
        title: trimmedTitle,
        completed: false,
      })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setInputValue('');
      })
      .catch(() => {
        catchErrors(Error.ADD);
        setInputValue(trimmedTitle);
        setTempTodo(null);
      })
      .finally(() => {
        setLoadingTodo((prev: number[]) =>
          prev.filter(id => id !== clientData.USER_ID),
        );

        setIsInputDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }

  const deleteTodo = useCallback((todoId: number) => {
    setLoadingTodo((prev: number[]) => [...prev, todoId]);
    clearError();

    clientData
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        catchErrors(Error.DELETE);
      })
      .finally(() => {
        setLoadingTodo((prev: number[]) => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  }, []);

  function updateTodo(todo: Todo) {
    const trimmedTitle = todo.title.trim();

    if (!trimmedTitle) {
      deleteTodo(todo.id);

      return;
    }

    const originalTodo = todos.find(oldTodo => oldTodo.id === todo.id);

    if (originalTodo && trimmedTitle === originalTodo.title) {
      setEditingTodoId(null);

      return;
    }

    setIsInputDisabled(true);
    setLoadingTodo((prev: number[]) => [...prev, todo.id]);
    clearError();

    clientData
      .updateTodos(todo.id, { title: trimmedTitle })
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos =>
          currentTodos.map(currTodos =>
            currTodos.id === updatedTodo.id ? updatedTodo : currTodos,
          ),
        );
      })
      .then(() => setEditingTodoId(null))
      .catch(() => {
        catchErrors(Error.UPDATE);
      })
      .finally(() => {
        setLoadingTodo((prev: number[]) => {
          return prev.filter(id => id !== todo.id);
        });
        setIsInputDisabled(false);
      });
  }

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setNewTitleTodo(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setNewTitleTodo('');
  };

  const toggleTodo = useCallback(
    (todo: Todo) => {
      if (loadingTodo.includes(todo.id)) {
        return;
      }

      setLoadingTodo((prev: number[]) => [...prev, todo.id]);

      clientData
        .updateTodos(todo.id, { completed: !todo.completed })
        .then((updatedTodo: Todo) => {
          setTodos(currentTodos =>
            currentTodos.map(currTodos =>
              currTodos.id === updatedTodo.id ? updatedTodo : currTodos,
            ),
          );
        })
        .catch(() => {
          catchErrors(Error.UPDATE);
        })
        .finally(() => {
          setLoadingTodo((prev: number[]) => {
            return prev.filter(id => id !== todo.id);
          });
        });
    },
    [loadingTodo],
  );

  const countTodosByStatus = (todosForFilter: Todo[], isCompleted: boolean) =>
    todosForFilter.filter(todo => todo.completed === isCompleted);
  const isTodosEmpty = todos.length;

  const toggleAllTodos = useCallback(() => {
    const completedTodos = countTodosByStatus(todos, true);
    const allCompleted = completedTodos.length === todos.length;

    todos.forEach(todo => {
      if (todo.completed === allCompleted) {
        toggleTodo(todo);
      }
    });
  }, [todos, toggleTodo]);

  const clearCompletedTodos = useCallback(() => {
    const allCompleted = todos.filter((todo: Todo) => todo.completed);

    allCompleted.forEach((todo: Todo) => deleteTodo(todo.id));
  }, [todos, deleteTodo]);

  const filteredByCompleted = todos.filter(todo => {
    switch (filterTodo) {
      case FilterBy.ACTIVE:
        return !todo.completed;

      case FilterBy.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  if (!clientData.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          notCompletedTodosCount={countTodosByStatus(todos, false).length}
          addTodo={addTodo}
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isInputDisabled={isInputDisabled}
          toggleAllTodos={toggleAllTodos}
          isTodosEmpty={isTodosEmpty}
        />
        {!isLoadingAll ? (
          <TodoList
            todos={filteredByCompleted}
            deleteTodo={deleteTodo}
            loadingTodo={loadingTodo}
            updateTodo={updateTodo}
            editingTodoId={editingTodoId}
            newTitleTodo={newTitleTodo}
            setNewTitleTodo={setNewTitleTodo}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            toggleTodo={toggleTodo}
          />
        ) : (
          <div>Loading...</div>
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            loadingTodo={loadingTodo}
            isTemp
            deleteTodo={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            notCompletedTodosCount={countTodosByStatus(todos, false).length}
            completedTodoCount={countTodosByStatus(todos, true).length}
            setFilterTodo={setFilterTodo}
            filterTodo={filterTodo}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={clearError}
      />
    </div>
  );
};

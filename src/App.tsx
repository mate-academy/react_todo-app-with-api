/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType } from './types/filterType';
import { ErrorMessages } from './types/errorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages | string>(
    ErrorMessages.none,
  );
  const [filterType, setFilterType] = useState<FilterType>(FilterType.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const errorTimer = useRef<number | null>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const handleErrorMessage = (message: ErrorMessages) => {
    setErrorMessage(message);

    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
    }

    if (message !== ErrorMessages.none) {
      errorTimer.current = window.setTimeout(() => {
        setErrorMessage(ErrorMessages.none);
        errorTimer.current = null;
      }, 3000);
    }
  };

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => handleErrorMessage(ErrorMessages.todosLoadError));
  }, []);

  const todosFilter = useCallback((filterBy: FilterType): Todo[] => {
    switch (filterBy) {
      case FilterType.all:
        return todos;
      case FilterType.active:
        return todos.filter(todo => !todo.completed);
      case FilterType.completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos])

  function handleAddTodo(title: string) {
    const newTodo: Todo = {
      title: title,
      completed: false,
      userId: USER_ID,
      id: 0,
    };

    setTempTodo(newTodo);
    setErrorMessage(ErrorMessages.none);

    return addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
      })
      .catch(error => {
        handleErrorMessage(ErrorMessages.todoAddError);

        // return Promise.reject();
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
      });
  }

  function handleDeleteTodo(id: number) {
    setErrorMessage(ErrorMessages.none);
    setLoadingTodoIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.todoDeleteError);

        return Promise.reject();
      })
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(prevID => prevID !== id)),
      );
  }

  function handleDeleteCompletedTodos() {
    Promise.allSettled(
      completedTodos.map(todo => handleDeleteTodo(todo.id)),
    ).then(results => {
      if (results.some(res => res.status === 'rejected')) {
        handleErrorMessage(ErrorMessages.todosDeleteError);
      }
    });
  }

  function handleToggleTodo(selectedTodo: Todo) {
    setErrorMessage(ErrorMessages.none);
    setLoadingTodoIds(prevIDs => [...prevIDs, selectedTodo.id]);

    let updatedTodo = todos.find(todo => todo.id === selectedTodo.id);

    if (!updatedTodo) {
      return;
    }

    updatedTodo = { ...updatedTodo, completed: !updatedTodo.completed };

    updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(
            todo => todo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todoFromServer);

          return newTodos;
        });
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.todosUpdateError);

        return Promise.reject();
      })
      .finally(() =>
        setLoadingTodoIds(prevIDs =>
          prevIDs.filter(id => id !== selectedTodo.id),
        ),
      );
  }

  function handleToggleAllTodos() {
    const allTodosCompleted = todos.every(todo => todo.completed);

    Promise.allSettled(
      todos.map(todo => {
        if (todo.completed === !allTodosCompleted) {
          return;
        }

        handleToggleTodo(todo);
      }),
    ).then(results => {
      if (results.some(res => res.status === 'rejected')) {
        handleErrorMessage(ErrorMessages.todosUpdateError);
      }
    });
  }

  function handleEditingTodo(editingId: number, title: string) {
    setErrorMessage(ErrorMessages.none);
    setLoadingTodoIds(prevIDs => [...prevIDs, editingId]);

    let updatedTodo = todos.find(todo => todo.id === editingId);

    if (!updatedTodo) {
      return Promise.reject();
    }

    updatedTodo = { ...updatedTodo, title: title };

    return updateTodo(updatedTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = currentTodos.findIndex(todo => todo.id === editingId);

          newTodos.splice(index, 1, todoFromServer);

          return newTodos;
        });
      })
      .catch(() => {
        handleErrorMessage(ErrorMessages.todosUpdateError);

        return Promise.reject();
      })
      .finally(() =>
        setLoadingTodoIds(prevIDs => prevIDs.filter(id => id !== editingId)),
      );
  }

  const filteredTodos = useMemo(() => {
    return todosFilter(filterType);
  }, [filterType, todosFilter]);

  const itemsLeft = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          onErrorMessage={handleErrorMessage}
          onAddTodo={handleAddTodo}
          toggleTodosId={loadingTodoIds}
          toggleAllTodos={handleToggleAllTodos}
        />

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            filteredTodos={filteredTodos}
            tempTodo={tempTodo}
            onDeletedTodo={handleDeleteTodo}
            completedTodos={completedTodos}
            onToggle={handleToggleTodo}
            loadingTodoIds={loadingTodoIds}
            onEditingTodo={handleEditingTodo}
          />
        </section>

        {todos.length !== 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filterType={filterType}
            onFilterClick={setFilterType}
            completedTodos={completedTodos}
            onDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onHideErrorButtonClick={setErrorMessage}
      />
    </div>
  );
};

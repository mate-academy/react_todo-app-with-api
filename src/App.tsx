/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { Todos } from './components/Todos';
import { SelectedFilter } from './types/SelectedFilter';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { ErrorMessages } from './types/ErrorMessages';
import classNames from 'classnames';
import { TodoState } from './types/TodoState';

function prepareTodos(todos: Todo[], filterQuery: SelectedFilter) {
  let visibleTodos = [...todos];

  switch (filterQuery) {
    case SelectedFilter.Active:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;
    case SelectedFilter.Completed:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
    case SelectedFilter.All:
      break;
  }

  return visibleTodos;
}

const ERROR_MESSAGE_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterQuery, setFilterQuery] = useState<SelectedFilter>(
    SelectedFilter.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  const [query, setQuery] = useState('');
  const [processingTodoIds, setProcessingTodoIds] = useState<TodoState[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const errorTimeoutId = useRef<number | null>(null);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleSelect = (newFilterQuery: SelectedFilter) => {
    setFilterQuery(newFilterQuery);
  };

  const handleError = useCallback((message: ErrorMessages) => {
    if (errorTimeoutId.current) {
      window.clearTimeout(errorTimeoutId.current);
    }

    setErrorMessage(message);

    errorTimeoutId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessages.None);
    }, ERROR_MESSAGE_TIMEOUT);
  }, []);

  const clearError = useCallback(() => {
    if (errorTimeoutId.current) {
      window.clearTimeout(errorTimeoutId.current);
    }

    setErrorMessage(ErrorMessages.None);
  }, []);

  const handleNewTodo = (title: string) => {
    clearError();
    setQuery(prev => prev.trim());
    if (!title) {
      handleError(ErrorMessages.ErrorEmptyTitle);

      return;
    }

    const newTodoData: Omit<Todo, 'id'> = {
      title: title,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodoData)
      .then(({ id, userId, title: todoTitle, completed }) => {
        const newTodo = {
          id: id,
          userId: userId,
          title: todoTitle,
          completed: completed,
        };

        setTodos(prevTodos => [...prevTodos, newTodo]);
        setQuery('');
      })
      .catch(() => {
        handleError(ErrorMessages.ErrorToAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTempTodo({
      id: 0,
      ...newTodoData,
    });
  };

  const handleTodoDelete = useCallback(
    (id: number) => {
      clearError();
      setProcessingTodoIds(prev => [
        ...prev,
        {
          id: id,
          state: 'loading',
        },
      ]);
      deleteTodo(id)
        .then(() => {
          setTodos(prev => {
            return prev.filter(todo => todo.id !== id);
          });
        })
        .catch(() => {
          handleError(ErrorMessages.ErrorToDeleteTodo);
        })
        .finally(() => {
          setProcessingTodoIds(prev => {
            const idIndex = prev.findIndex(elem => elem.id === id);

            return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
          });
        });
    },
    [handleError, clearError],
  );

  const handleAllCompletedDelete = () => {
    const ids: TodoState[] = todos
      .filter(todo => todo.completed)
      .map(todo => ({
        id: todo.id,
        state: 'loading',
      }));

    setProcessingTodoIds(prev => [...prev, ...ids]);
    clearError();

    Promise.allSettled(ids.map(todo => deleteTodo(todo.id)))
      .then(responses => {
        type Reduce = {
          fulfilled: number[];
          rejected: number[];
        };

        const { fulfilled, rejected } = responses.reduce<Reduce>(
          (idsStatuses, response, index) => {
            idsStatuses[response.status].push(ids[index].id);

            return idsStatuses;
          },
          {
            fulfilled: [],
            rejected: [],
          },
        );

        if (fulfilled.length > 0) {
          setTodos(prev => prev.filter(todo => !fulfilled.includes(todo.id)));
        }

        if (rejected.length > 0) {
          handleError(ErrorMessages.ErrorToDeleteTodo);
        }
      })
      .finally(() => {
        setProcessingTodoIds(prev => prev.filter(todo => !ids.includes(todo)));
      });
  };

  const handleTodoCompletedToggle = useCallback(
    (id: number) => {
      clearError();

      const updatingTodo = todos.find(todo => todo.id === id);

      if (!updatingTodo) {
        return;
      }

      const newCompleted = !updatingTodo.completed;

      setProcessingTodoIds(prev => [
        ...prev,
        {
          id: id,
          state: 'loading',
        },
      ]);

      updateTodo(id, { completed: newCompleted })
        .then(({ id: todoId, userId, title, completed }) => {
          const updatedTodo: Todo = {
            id: todoId,
            userId: userId,
            title: title,
            completed: completed,
          };

          setTodos(prev => {
            return prev.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            );
          });
        })
        .catch(() => {
          handleError(ErrorMessages.ErrorToUpdateTodo);
        })
        .finally(() => {
          setProcessingTodoIds(prev =>
            prev.filter(prevTodo => prevTodo.id !== id),
          );
        });
    },
    [handleError, clearError, todos],
  );

  const handleTodoAllCompletedToggle = (areAllCompleted: boolean) => {
    const ids: TodoState[] = todos
      .filter(todo => todo.completed == areAllCompleted)
      .map(todo => ({
        id: todo.id,
        state: 'loading',
      }));

    const toggleTo = !areAllCompleted;

    clearError();
    setProcessingTodoIds(prev => [...prev, ...ids]);

    Promise.allSettled(
      ids.map(todo => updateTodo(todo.id, { completed: toggleTo })),
    )
      .then(responses => {
        type Reduce = {
          fulfilled: Todo[];
          rejected: number[];
        };

        const { fulfilled, rejected } = responses.reduce<Reduce>(
          (filteredResponses, currentResponse, index) => {
            if (currentResponse.status === 'fulfilled') {
              const updatedTodo = {
                id: currentResponse.value.id,
                userId: currentResponse.value.userId,
                title: currentResponse.value.title,
                completed: currentResponse.value.completed,
              };

              filteredResponses.fulfilled.push(updatedTodo);
            } else {
              filteredResponses.rejected.push(ids[index].id);
            }

            return filteredResponses;
          },
          {
            fulfilled: [],
            rejected: [],
          },
        );

        if (rejected.length > 0) {
          handleError(ErrorMessages.ErrorToUpdateTodo);
        }

        if (fulfilled.length > 0) {
          setTodos(prev => {
            const fulfilledMapped = new Map(
              fulfilled.map(todo => [todo.id, todo]),
            );

            return prev.map(todo =>
              fulfilledMapped.has(todo.id)
                ? (fulfilledMapped.get(todo.id) as Todo)
                : todo,
            );
          });
        }
      })
      .finally(() => {
        setProcessingTodoIds(prev =>
          prev.filter(prevId => !ids.includes(prevId)),
        );
      });
  };

  const handleEditTodo = useCallback(
    (title: string, id: number) => {
      if (!title) {
        handleTodoDelete(id);

        return;
      }

      const pastTodo = todos.find(todo => todo.id === id) as Todo;

      if (pastTodo.title === title) {
        setEditingTodoId(null);

        return;
      }

      clearError();
      setProcessingTodoIds(prev => [
        ...prev,
        {
          id: id,
          state: 'editloading',
        },
      ]);

      updateTodo(id, { title: title })
        .then(response => {
          if (editingTodoId === id) {
            setEditingTodoId(null);
          }

          const updatedTodo: Todo = {
            id: response.id,
            title: response.title,
            userId: response.userId,
            completed: response.completed,
          };

          setTodos(prev => {
            return prev.map(todo =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            );
          });
        })
        .catch(() => {
          handleError(ErrorMessages.ErrorToUpdateTodo);
        })
        .finally(() => {
          setProcessingTodoIds(prev => {
            const idIndex = prev.findIndex(elem => elem.id === id);

            return [...prev.slice(0, idIndex), ...prev.slice(idIndex + 1)];
          });
        });
    },
    [clearError, todos, handleError, editingTodoId, handleTodoDelete],
  );

  const handleDeleteError = () => {
    setErrorMessage(ErrorMessages.None);
  };

  useEffect(() => {
    const handleCancelEditing = () => {
      setEditingTodoId(null);
    };

    getTodos()
      .then(setTodos)
      .catch(() => {
        handleError(ErrorMessages.ErrorTodoLoad);
      });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCancelEditing();
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [handleError]);

  const visibleTodos = prepareTodos(todos, filterQuery);
  const remainingTodos = todos.reduce((acc, todo) => acc + +!todo.completed, 0);

  const isLoadingAddingTodo = tempTodo !== null;
  const isLoadingSomething = processingTodoIds.length > 0;
  const areNoneCompleted = todos.every(todo => !todo.completed);
  const areAllCompleted = todos.every(todo => todo.completed);

  const isEditing = editingTodoId !== null;
  const emptyTodos = todos.length === 0;

  const isProcessing = isLoadingAddingTodo || isLoadingSomething || isEditing;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          areAllCompleted={areAllCompleted}
          isProcessing={isProcessing}
          isAdding={isLoadingAddingTodo}
          query={query}
          emptyTodos={emptyTodos}
          onQueryChange={handleQueryChange}
          onNewTodo={handleNewTodo}
          onCompleteToggle={handleTodoAllCompletedToggle}
        />

        <Todos
          todos={visibleTodos}
          loadingTodoIds={processingTodoIds}
          tempTodo={tempTodo}
          editingTodoId={editingTodoId}
          onTodoDelete={handleTodoDelete}
          onOneTodoToggle={handleTodoCompletedToggle}
          onSettingEditingTodo={setEditingTodoId}
          onEditTodo={handleEditTodo}
        />

        {todos.length > 0 && (
          <Footer
            selected={filterQuery}
            itemCount={remainingTodos}
            areNoneCompleted={areNoneCompleted}
            onSelect={handleSelect}
            onCompletedDelete={handleAllCompletedDelete}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorMessage === ErrorMessages.None,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => handleDeleteError()}
        />
        {errorMessage !== ErrorMessages.None && errorMessage}
      </div>
    </div>
  );
};

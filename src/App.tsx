import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';

import { ErrorNotification } from './components/ErrorNotification';
import { Footer, TodoStatus } from './components/Footer';
import { Header, TodoAddOperationStatus } from './components/Header';
import { Todo } from './types/Todo';
import { Todo as TodoItem } from './components/Todo';
import { DefaultErrorMessages, ErrorMessage } from './types/ErrorMessages';

export const App: React.FC = () => {
  // TODO? hide the notification BEFORE every next request.

  // #region todo display state and preparation

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIdsState, setLoadingTodoIdsState] = useState<number[]>([]);
  const loadingTodoIdsRef = useRef<Set<number>>(new Set());
  // The ref is to conquer the Catch-22 in the handleDeleteAllCompleted method:
  //  requiring the freshest loadingTodoIds state synchronously
  //  after calling the updating function.
  const [filteringByCompleted, setFilteringByCompleted] = useState(
    TodoStatus.All,
  );

  const filteredTodos = todos.filter(todo => {
    let satisfiesCompleted: boolean;

    switch (filteringByCompleted) {
      case TodoStatus.Active:
        satisfiesCompleted = !todo.completed;
        break;
      case TodoStatus.Completed:
        satisfiesCompleted = todo.completed;
        break;
      default:
        satisfiesCompleted = true;
        break;
    }

    return satisfiesCompleted;
  });

  let incompleteTodoQuantity = 0;

  todos.forEach(todo => {
    if (!todo.completed) {
      incompleteTodoQuantity += 1;
    }
  });

  const hasCompletedTodos = todos.length !== incompleteTodoQuantity;

  // #endregion

  // #region error state

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    DefaultErrorMessages.NONE,
  );
  const [errorRenderIteration, setErrorRenderIteration] = useState(1);

  // #endregion

  // #region todo manipulation meta state etc

  const [processingDeleteCompleted, setProcessingDeleteCompleted] =
    useState(false);
  const [todoAddOperationStatus, setTodoAddOperationStatus] = useState(
    TodoAddOperationStatus.SUCCESS,
  );
  const [taskInputFocusTrigger, setTaskInputFocusTrigger] = useState(true);

  // #endregion

  // #region additional state manipulation functions

  const displayError = useCallback(
    (message: typeof errorMessage) => {
      setErrorMessage(message);
      setErrorRenderIteration(current => current + 1);
    },
    [setErrorMessage, setErrorRenderIteration],
  );

  function updateLoadingTodoIdsState() {
    setLoadingTodoIdsState(Array.from(loadingTodoIdsRef.current));
  }

  function markAsLoading(id: number) {
    // TODO*: Could be split into separate actions to aggregate and not run
    // TODO*:  updateLoadingTodoIdsState on every single id change.
    loadingTodoIdsRef.current.add(id);
    updateLoadingTodoIdsState();
  }

  function unmarkAsLoading(id: number) {
    loadingTodoIdsRef.current.delete(id);
    updateLoadingTodoIdsState();
  }

  function focusInput() {
    setTaskInputFocusTrigger(current => !current);
  }

  // #endregion

  // #region todo manipulation functions

  // > Fetch
  const handleFetchTodos = useCallback(async () => {
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_LOAD);
    }
  }, [setTodos, displayError]);

  // > Single add
  async function handleAddNewTodo(title: string) {
    setTodoAddOperationStatus(TodoAddOperationStatus.LOADING);

    const trimmed = title.trim();

    if (!trimmed.length) {
      displayError(DefaultErrorMessages.EMPTY_TITLE);
      setTodoAddOperationStatus(TodoAddOperationStatus.ERROR);

      return;
    }

    const todoData = { title: trimmed, userId: USER_ID, completed: false };

    setTempTodo({ ...todoData, id: 0 });

    try {
      const newTodo = await addTodo(todoData);

      setTodos(current => [...current, newTodo]);
      setTodoAddOperationStatus(TodoAddOperationStatus.SUCCESS);
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_ADD);
      setTodoAddOperationStatus(TodoAddOperationStatus.ERROR);
    } finally {
      setTempTodo(null);
      focusInput();
    }
  }

  // > Signle remove
  async function handleDeleteTodo(id: number) {
    markAsLoading(id);

    try {
      await deleteTodo(id);

      setTodos(current => [...current].filter(todo => todo.id !== id));
      // ? Is putting the state in ref in Set
      // ? and .deleting it there more effective?
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_DELETE);
    } finally {
      unmarkAsLoading(id);
      focusInput();
    }
  }

  // > Batch remove
  async function handleDeleteAllCompleted() {
    setProcessingDeleteCompleted(true);

    const idsToDeleteInThisOperation: number[] = [];

    for (const todo of todos) {
      const id = todo.id;

      if (todo.completed && !loadingTodoIdsRef.current.has(id)) {
        idsToDeleteInThisOperation.push(id);
        markAsLoading(id);
      }
    }

    const deletions = await Promise.allSettled(
      idsToDeleteInThisOperation.map(deleteTodo),
    );

    setTodos(current => {
      const copy = [...current].filter(todo => {
        const deletionIndex = idsToDeleteInThisOperation.indexOf(todo.id);

        if (
          deletionIndex >= 0 &&
          deletions[deletionIndex].status === 'fulfilled'
        ) {
          return false;
        }

        return true;
      });

      return copy;
    });

    if (deletions.some(result => result.status === 'rejected')) {
      displayError(DefaultErrorMessages.FAILED_DELETE);
    }

    idsToDeleteInThisOperation.forEach(unmarkAsLoading);
    setProcessingDeleteCompleted(false);
    focusInput();
  }

  // > Single status toggle
  async function handleToggleTodoStatus(id: number) {
    markAsLoading(id);

    const targetIndex = todos.findIndex(todo => todo.id === id);

    if (targetIndex === -1) {
      return;
    }

    const targetStatus = !todos[targetIndex].completed;

    try {
      const result = await updateTodo(id, { completed: targetStatus });

      // If the user gets no change, that means the problem is on the backend.
      setTodos(current => {
        // Previous targetIndex was not synced, so the new search is required.
        //  This is instead of putting it into a ref,
        //  which I did for "loading" state.
        const syncedTargetIndex = current.findIndex(todo => todo.id === id);

        if (syncedTargetIndex === -1) {
          return [...current];
        }

        return current.toSpliced(syncedTargetIndex, 1, result);
      });
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_UPDATE);
    } finally {
      unmarkAsLoading(id);
      focusInput();
    }
  }

  // > Batch status toggle
  async function handleToggleAllTodoStatus() {
    const initialStatus = !incompleteTodoQuantity;

    // A separate array could be created just for the target ids.

    // The next two loops could be united.
    todos.forEach(todo => {
      if (todo.completed === initialStatus) {
        markAsLoading(todo.id);
      }
    });

    const updates = await Promise.allSettled(
      todos.map(todo => {
        if (todo.completed === initialStatus) {
          return updateTodo(todo.id, { completed: !initialStatus });
        }

        return null;
        // BTW: All nulls here would result in a fully redundant objects.
      }),
    );

    // A separate array could be created just for successful requests.

    setTodos(current => {
      const copy = [...current];

      updates.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          const todo = result.value;

          copy.splice(
            copy.findIndex(todoFromState => todoFromState.id === todo.id),
            1,
            todo,
          );
        }
      });

      return copy;
    });

    if (updates.some(result => result.status === 'rejected')) {
      displayError(DefaultErrorMessages.FAILED_UPDATE);
    }

    todos.forEach(todo => {
      if (todo.completed === initialStatus) {
        unmarkAsLoading(todo.id);
      }
    });

    focusInput();
  }

  // #endregion

  // #region fetching

  useEffect(() => {
    handleFetchTodos();
  }, [handleFetchTodos]);

  // #endregion

  // #region returns

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isToggleAllVisible={todos.length !== 0}
          isToggleAllActive={incompleteTodoQuantity === 0}
          onSubmit={handleAddNewTodo}
          todoAddStatus={todoAddOperationStatus}
          focusTrigger={taskInputFocusTrigger}
          handleToggleAll={handleToggleAllTodoStatus}
        />

        {(!!todos.length || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map(todo => {
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  isSelected={false}
                  isLoading={loadingTodoIdsState.includes(todo.id)}
                  onDelete={handleDeleteTodo}
                  onToggleCompleted={handleToggleTodoStatus}
                />
              );
            })}

            {tempTodo && (
              <TodoItem
                key="loading"
                todo={tempTodo}
                isSelected={false}
                isLoading={true}
                onDelete={() => null}
                onToggleCompleted={() => null}
              />
            )}
          </section>
        )}

        {!!todos.length && (
          <Footer
            incompleteTodoQuantity={incompleteTodoQuantity}
            onFilterSelect={setFilteringByCompleted}
            activeFiltering={filteringByCompleted}
            onDeleteCompleted={handleDeleteAllCompleted}
            isDeleteCompletedButtonDisabled={
              !hasCompletedTodos || processingDeleteCompleted
            }
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        key={errorRenderIteration}
      />
    </div>
  );

  // #endregion
};

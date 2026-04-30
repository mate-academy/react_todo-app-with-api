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

type TodoDict = {
  [key: number]: Todo;
};
// Also matches an array but ok.

export const App: React.FC = () => {
  // TODO? hide the notification BEFORE every next request.
  // ! The project was accepted without this feature.

  // #region todo display state and preparation

  const [todosDict, setTodosDict] = useState<TodoDict>({});
  // * The limitation is that todos could only be displayed
  // *  in the ascending order of their ids.
  const [todosIdList, setTodosIdList] = useState<number[]>([]);
  const [loadingTodoIdsState, setLoadingTodoIdsState] = useState<number[]>([]);
  const loadingTodoIdsRef = useRef<Set<number>>(new Set());
  // The ref is to conquer the Catch-22 in the handleDeleteAllCompleted method:
  //  requiring the freshest loadingTodoIds state synchronously
  //  after calling the updating function.
  // Ref is for synchronicity, Set is for deduplication.
  // ! Use object for deduplication too?
  // TODO: Do this in those components themselves?

  // > CONTROLLING MORE OF THE TODO'S INTERNAL STATE FROM THE PARENT:
  // >  AN INTERESTING EXPERIMENT.
  // const [todoTitleChangeErrorIds, setTodoTitleChangeErrorIds] =
  //   useState<number[]>([]);
  // TODO: Try it out with this array or a set.
  // ? Is it possible to do with a single id in state, and React.memo's
  // ?  arePropsEqual? Like based on props.todo.title or isLoading etc.
  // ?  Instead of an Array.
  // const [todoTitleChangeErrorId, setTodoTitleChangeErrorId] =
  //   useState(TodoAddOperationStatus.SUCCESS);
  //   useState(-1);
  // * Options:
  // 1. Separate hasError array, add and remove.
  // 2. Separate hasError array for all, true or false.
  //      + Easier to match, by index.
  //      - Too much state.
  // ?    - Can mix up positions relatively to todos? Can it?
  // 3. A map with both loading and error flags.
  //      - A lot of objects, small amount of errors at a time.
  // 4. Include flags in the todos array.
  //      - Too much types.
  //      - Also too much rerenders.
  // * Lifecycle of meta state:
  //      1. Stuff loads -- mark loading, remove error.
  //      2. Something proceeds -- remove loading.
  //      3. Something doesn't proceed -- mark error, remove loading.
  // * Three-value state:
  //      1. Header input -- single element.
  //      2. Todo -- multiple elements, rare errors...?

  // > Other application state logic
  const [processingDeleteCompleted, setProcessingDeleteCompleted] =
    useState(false);
  const [todoAddOperationStatus, setTodoAddOperationStatus] = useState(
    TodoAddOperationStatus.SUCCESS,
  );
  const [taskInputFocusTrigger, setTaskInputFocusTrigger] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteringByCompleted, setFilteringByCompleted] = useState(
    TodoStatus.All,
  );

  // > Preparation
  const filteredTodoIds = todosIdList.filter(id => {
    let satisfiesCompleted: boolean;

    switch (filteringByCompleted) {
      case TodoStatus.Active:
        satisfiesCompleted = !todosDict[id].completed;
        break;
      case TodoStatus.Completed:
        satisfiesCompleted = todosDict[id].completed;
        break;
      default:
        satisfiesCompleted = true;
        break;
    }

    return satisfiesCompleted;
  });

  let incompleteTodoQuantity = 0;

  todosIdList.forEach(id => {
    if (!todosDict[id].completed) {
      incompleteTodoQuantity += 1;
    }
  });

  const hasCompletedTodos = todosIdList.length !== incompleteTodoQuantity;

  // #endregion

  // #region error state

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    DefaultErrorMessages.NONE,
  );
  const [errorRenderIteration, setErrorRenderIteration] = useState(1);

  // #endregion

  // #region additional state manipulation functions

  const displayError = useCallback(
    (message: typeof errorMessage) => {
      setErrorMessage(message);
      setErrorRenderIteration(current => current + 1);
    },
    [setErrorMessage, setErrorRenderIteration],
  );

  function commitLoadingState() {
    setLoadingTodoIdsState(Array.from(loadingTodoIdsRef.current));
  }

  function scheduleForStartLoading(id: number) {
    loadingTodoIdsRef.current.add(id);
  }

  function scheduleForEndLoading(id: number) {
    loadingTodoIdsRef.current.delete(id);
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

      const fetchedTodosDict: TodoDict = {};
      const fetchedTodosIds: number[] = [];

      fetchedTodos.forEach(todo => {
        fetchedTodosDict[todo.id] = todo;
        fetchedTodosIds.push(todo.id);
      });

      setTodosDict(fetchedTodosDict);
      setTodosIdList(fetchedTodosIds);
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_LOAD);
    }
  }, [setTodosDict, displayError]);

  // > Single add
  async function handleAddNewTodo(title: string) {
    const trimmed = title.trim();

    if (!trimmed.length) {
      displayError(DefaultErrorMessages.EMPTY_TITLE);
      // setTodoAddOperationStatus(TodoAddOperationStatus.ERROR);

      return;
    }

    setTodoAddOperationStatus(TodoAddOperationStatus.LOADING);

    const todoData = { title: trimmed, userId: USER_ID, completed: false };

    setTempTodo({ ...todoData, id: 0 });

    try {
      const newTodo = await addTodo(todoData);

      setTodosDict(current => ({ ...current, [newTodo.id]: newTodo }));
      setTodosIdList(current => [...current, newTodo.id]);
      setTodoAddOperationStatus(TodoAddOperationStatus.SUCCESS);
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_ADD);
      setTodoAddOperationStatus(TodoAddOperationStatus.ERROR);
    } finally {
      setTempTodo(null);
      focusInput();
    }
  }

  // > Single remove
  async function handleDeleteTodo(id: number) {
    scheduleForStartLoading(id);
    commitLoadingState();

    try {
      await deleteTodo(id);

      setTodosDict(current => {
        const copy = { ...current };

        delete copy[id];

        return copy;
      });

      setTodosIdList(current =>
        [...current].filter(currentId => currentId !== id),
      );

      return;
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_DELETE);
      throw error;
    } finally {
      scheduleForEndLoading(id);
      commitLoadingState();
      focusInput();
    }
  }

  // > Batch remove
  async function handleDeleteAllCompleted() {
    setProcessingDeleteCompleted(true);

    const idsToDeleteInThisOperation: number[] = [];

    todosIdList.forEach(id => {
      if (todosDict[id].completed) {
        // The check for loading is not required in a Set.
        scheduleForStartLoading(id);
        idsToDeleteInThisOperation.push(id);
      }
    });

    commitLoadingState();

    const deletions = await Promise.allSettled(
      idsToDeleteInThisOperation.map(deleteTodo),
    );
    // ? Is there a way to attach ids to deletions though?

    const idsOfSuccessful: number[] = [];

    deletions.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        idsOfSuccessful.push(idsToDeleteInThisOperation[index]);
      }
    });

    if (!!idsOfSuccessful.length) {
      setTodosDict(current => {
        const copy = { ...current };

        idsOfSuccessful.forEach(id => {
          delete copy[id];
        });

        return copy;
      });

      setTodosIdList(current =>
        [...current].filter(id => !idsOfSuccessful.includes(id)),
      );
    }

    if (idsOfSuccessful.length < deletions.length) {
      displayError(DefaultErrorMessages.FAILED_DELETE);
    }

    // Working with deleted ids too because they're still in this state.
    idsToDeleteInThisOperation.forEach(scheduleForEndLoading);
    // ! Would this approach mess up with a parallel request?
    // *  I think yes, if e.g. in another asynchronous action, that takes less
    // *  time than this one, this exact todo.id would be deleted from loading
    // *  state.
    // *  But the `todo.completed === true` todos would be the same as in the
    // *  beginning of this function call, the same snapshot.
    // todos.forEach(todo => {
    //   if (todo.completed) {
    //     scheduleForEndLoading(todo.id);
    //   }
    // });
    commitLoadingState();
    setProcessingDeleteCompleted(false);
    focusInput();
  }

  // > Single status toggle
  async function handleToggleTodoStatus(id: number) {
    scheduleForStartLoading(id);
    commitLoadingState();

    try {
      const result = await updateTodo(id, {
        completed: !todosDict[id].completed,
      });

      // If the user gets no change, that means the problem is on the backend.
      setTodosDict(current => ({ ...current, [result.id]: result }));
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_UPDATE);
    } finally {
      scheduleForEndLoading(id);
      commitLoadingState();
      focusInput();
    }
  }

  // > Batch status toggle
  async function handleToggleAllTodoStatus() {
    const initialStatus = !incompleteTodoQuantity;
    const requests: Promise<Todo>[] = [];
    // ? Could it throw before the code reaches Promise.allSettled(),
    // ?  if it was something that throws?

    todosIdList.forEach(id => {
      if (todosDict[id].completed === initialStatus) {
        scheduleForStartLoading(id);
        /* eslint-disable */
        requests.push(
          updateTodo(id, { completed: !initialStatus })
          // ! This allows to desynchronize the state with other actions:
          // .then(result => {
          //   return new Promise(resolve => {
          //     setTimeout(() => {
          //       resolve(result);
          //     }, 3000);
          //   });
          // }),
        );
        /* eslint-enable */
      }
    });

    commitLoadingState();

    const updates = await Promise.allSettled(requests);
    /*
     * During the await all the other calls can happen.
     *  And initially you use asynchronous code to not stop the user from using
     *  the webpage, but the freedom you give them depends on the restrictions
     *  you explicitly provide. If you restrict any interaction with the
     *  business-logic-related controls of your app, then the user would be
     *  able to interact with just the application logic and native platform
     *  capabilities. This itself takes some effort.
     *  But letting them use some part of the buiness logic and make sure
     *  nothing wrong will happen unexpectedly is a whole other quest for me
     *  currently.
     */

    if (updates.some(result => result.status === 'fulfilled')) {
      setTodosDict(current => {
        const copy = { ...current };

        updates.forEach(result => {
          if (result.status === 'fulfilled') {
            copy[result.value.id] = result.value;
            // ? Or would it be better to change just the `completed` value?:
            // ?  copy[result.value.id].completed = result.value.completed;
          }
        });

        return copy;
      });
    }

    if (updates.some(result => result.status === 'rejected')) {
      displayError(DefaultErrorMessages.FAILED_UPDATE);
    }

    todosIdList.forEach(id => {
      if (todosDict[id].completed === initialStatus) {
        scheduleForEndLoading(id);
      }
    });

    commitLoadingState();
    focusInput();
  }

  // > Title change
  async function handleTodoTitleChange(id: number, newTitleTrimmed: string) {
    if (!newTitleTrimmed.length) {
      return handleDeleteTodo(id);
    }

    scheduleForStartLoading(id);
    commitLoadingState();

    try {
      const result = await updateTodo(id, { title: newTitleTrimmed });

      setTodosDict(current => ({ ...current, [result.id]: result }));

      focusInput();

      return;
    } catch (error) {
      displayError(DefaultErrorMessages.FAILED_UPDATE);
      throw error;
    } finally {
      scheduleForEndLoading(id);
      commitLoadingState();
    }
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
          isToggleAllVisible={todosIdList.length !== 0}
          isToggleAllActive={incompleteTodoQuantity === 0}
          onSubmit={handleAddNewTodo}
          todoAddStatus={todoAddOperationStatus}
          focusTrigger={taskInputFocusTrigger}
          handleToggleAll={handleToggleAllTodoStatus}
        />

        {(!!todosIdList.length || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodoIds.map(id => {
              const todo = todosDict[id];

              return (
                <TodoItem
                  key={id}
                  todo={todo}
                  isLoading={loadingTodoIdsState.includes(id)}
                  onDelete={handleDeleteTodo}
                  onToggleCompleted={handleToggleTodoStatus}
                  onTitleChange={handleTodoTitleChange}
                />
              );
            })}

            {tempTodo && (
              <TodoItem
                key="loading"
                todo={tempTodo}
                isLoading={true}
                onDelete={() => null}
                onToggleCompleted={() => null}
                onTitleChange={() => Promise.resolve()}
              />
            )}
          </section>
        )}

        {!!todosIdList.length && (
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

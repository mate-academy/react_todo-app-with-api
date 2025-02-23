/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
// #region imports
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorMessages } from './types/Errors';
import { FilterStatus } from './types/FilterStatus';
import { AddingParams } from './types/AddingParams';
import { DeletingParams } from './types/DeletingParams';
import { CheckUpdatingParams } from './types/CheckUpdatingParams';
import { TitleChangeParams } from './types/TitleChangeParams';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { todosHandlings } from './services/todosHandlings';

// #endregion

export const App: React.FC = () => {
  // #region todos and errors
  const [todos, setTodos] = useState<Todo[]>([]);
  const sortedTodos = useMemo(
    () => ({
      active: todos.filter(todo => !todo.completed),
      completed: todos.filter(todo => todo.completed),
    }),
    [todos],
  );

  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(
    ErrorMessages.None,
  );
  // #endregion

  // #region filterStatus and  filter handling
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );

  const getFilteredTodos = useCallback(
    (allTodos: Todo[], status: FilterStatus) => {
      let filteredTodos;
      const { active, completed } = sortedTodos;

      switch (status) {
        case FilterStatus.Completed:
          filteredTodos = completed;
          break;
        case FilterStatus.Active:
          filteredTodos = active;
          break;

        default:
          filteredTodos = [...allTodos];
      }

      return filteredTodos;
    },
    [sortedTodos],
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filterStatus),
    [getFilteredTodos, todos, filterStatus],
  );
  // #endregion

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessages.Loading);
      });
  }, []);

  // #region loading handling
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const changeLoadingIds = useMemo(
    () => ({
      add(ids: number | number[]) {
        if (typeof ids === 'number') {
          setLoadingIds(currentIds => [...currentIds, ids]);
        } else {
          setLoadingIds(currentIds => [...currentIds, ...ids]);
        }
      },
      delete(ids: number | number[]) {
        if (typeof ids === 'number') {
          setLoadingIds(currentIds =>
            currentIds.filter(todoId => todoId !== ids),
          );
        } else {
          setLoadingIds(currentIds =>
            currentIds.filter(id => !ids.includes(id)),
          );
        }
      },
    }),
    [],
  );
  // #endregion

  // #region add and delete handlings
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleAddingTodo = useCallback(
    (newTodoTitle: string) => {
      const adddingParams: AddingParams = {
        currentTodos: todos,
        newTodoTitle: newTodoTitle,
        userId: USER_ID,
        onTempTodoAdd: setTempTodo,
        onTodoAdding: setTodos,
        onError: setErrorMessage,
      };

      return todosHandlings.add(adddingParams);
    },
    [todos],
  );

  const handleDeleting = useMemo(() => {
    const deletingParams: DeletingParams = {
      currentTodos: todos,
      activeTodos: sortedTodos.active,
      addLoading: changeLoadingIds.add,
      deleteLoading: changeLoadingIds.delete,
      onTodoDeleting: setTodos,
      onError: setErrorMessage,
    };

    return todosHandlings.delete(deletingParams);
  }, [todos, sortedTodos, changeLoadingIds]);
  // #endregion

  // #region updating handlings
  const handleCheckUpdate = useMemo(() => {
    const updateParams: CheckUpdatingParams = {
      currentTodos: todos,
      addLoading: changeLoadingIds.add,
      deleteLoading: changeLoadingIds.delete,
      onTodoUpdating: setTodos,
      onError: setErrorMessage,
    };

    return todosHandlings.checkUpdate(updateParams);
  }, [todos, changeLoadingIds]);

  const handleTitleChange = useCallback(
    (todo: Todo, newTitle: string) => {
      const titleChangeParams: TitleChangeParams = {
        currentTodos: todos,
        currentTodo: todo,
        newTitle: newTitle,
        addLoading: changeLoadingIds.add,
        deleteLoading: changeLoadingIds.delete,
        onTodosUpdating: setTodos,
        onError: setErrorMessage,
      };

      return todosHandlings.titleUpdate(titleChangeParams);
    },
    [todos, changeLoadingIds],
  );
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onToggle={handleCheckUpdate.multipleTodos}
          onAdding={handleAddingTodo}
          onError={setErrorMessage}
        />

        {/*I've added children prop to avoid prop drilling*/}
        <TodoList todos={filteredTodos}>
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleCheckUpdate.oneTodo}
              onTitleChange={handleTitleChange}
              isTodoLoading={loadingIds.includes(todo.id)}
              onDelete={handleDeleting.todo}
            />
          ))}
        </TodoList>

        <TransitionGroup>
          {tempTodo && (
            <CSSTransition key={0} timeout={300} classNames="temp-item">
              <TodoItem todo={tempTodo} isTodoLoading={true} />
            </CSSTransition>
          )}
        </TransitionGroup>

        {!!todos.length && (
          <Footer
            sortedTodos={sortedTodos}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
            onCompletedDelete={handleDeleting.completedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorClean={setErrorMessage}
      />
    </div>
  );
};

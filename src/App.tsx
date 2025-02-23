/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTypes } from './types/FilterTypes';
import { getPreparedTodos } from './utils/GetPreparedTodos';
import { getIdsOfActiveTodos } from './utils/getAmountOfActiveTodos';
import { Footer } from './components/Footer/Footer';
import { Errors } from './utils/Errors';
import { ErrorsField } from './components/ErrorsField/ErrorsField';
import { Header } from './components/Header/Header';
import { USER_ID } from './utils/CONSTANTS';
import { deletingTodo } from './utils/deletingTodo';
import { handleGetTodos } from './utils/handleGetTodos';
import { updatingTodo } from './utils/updatingTodo';
import { TodoOmited } from './types/TodoOmited';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterInstructions, setFilterInstructions] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [pendingTodosId, setPendingTodosId] = useState<number[]>([]);

  const handleDeleteTodo = (ids: number[]): Promise<void[] | void> => {
    return deletingTodo(ids, setErrorMessage, setTodos, setPendingTodosId).then(
      () => setPendingTodosId([]),
    );
  };

  const handleAddTodo = (newTodo: Todo) => {
    setTodos(prevState => [...prevState, newTodo]);
  };

  const handleUpdateTodo = (todosToUpdate: TodoOmited[]) => {
    return updatingTodo(
      todosToUpdate,
      setErrorMessage,
      setTodos,
      setPendingTodosId,
    )
      .catch(error => {
        throw error;
      })
      .finally(() => setPendingTodosId([]));
  };

  const unfinishedTodoIds = useMemo(() => getIdsOfActiveTodos(todos), [todos]);

  const completedTodosIds = useMemo(
    () => getPreparedTodos(todos, FilterTypes.Completed).map(todo => todo.id),
    [todos],
  );

  const handleToggleAllTodos = () => {
    if (unfinishedTodoIds.length) {
      handleUpdateTodo(
        unfinishedTodoIds.map((id: number) => ({
          ...(todos.find(todo => todo.id === id) || { id: 0 }),
          completed: true,
        })),
      );

      return;
    }

    handleUpdateTodo(
      completedTodosIds.map((id: number) => ({
        ...(todos.find(todo => todo.id === id) || { id: 0 }),
        completed: false,
      })),
    );
  };

  useEffect(() => {
    handleGetTodos(setTodos, setErrorMessage);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const preparedTodos = getPreparedTodos(todos, filterInstructions);
  const shouldFooterBeShown = !!todos.length || !!tempTodo;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          unfinishedTodoIds={unfinishedTodoIds}
          todosLength={todos.length}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          tempTodo={tempTodo}
          onAddTodo={handleAddTodo}
          onToggleAddTodos={handleToggleAllTodos}
        />

        <TodoList
          onDeleteTodo={handleDeleteTodo}
          todos={preparedTodos}
          tempTodo={tempTodo}
          onErrorMessageChange={setErrorMessage}
          onUpdateTodo={handleUpdateTodo}
          pendingTodosId={pendingTodosId}
        />

        {shouldFooterBeShown && (
          <Footer
            unfinishedTodoAmount={unfinishedTodoIds.length}
            filterInstructions={filterInstructions}
            setFilterInstructions={setFilterInstructions}
            completedTodosIds={completedTodosIds}
            onDeleteTodo={handleDeleteTodo}
          />
        )}
      </div>

      <ErrorsField
        errorMessage={errorMessage}
        onErrorMessageChange={setErrorMessage}
      />
    </div>
  );
};

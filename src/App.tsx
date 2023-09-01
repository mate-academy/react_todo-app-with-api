/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { SortBy } from './types/SortBy';
import { deleteTodo, updateTodo } from './api/todos';
import { Todos } from './components/Todos';
import { useGetTodos } from './hooks';
import { Errors } from './types';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

const USER_ID = 11361;

export const App: React.FC = () => {
  const [userId] = useState(USER_ID);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.all);
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isDeleteUpdateTodo, setIsDeleteUpdateTodo] = useState<boolean>(false);
  const [makeAnyChange, setMakeAnyChange] = useState<boolean>(false);
  const {
    isLoading,
    todos,
    errorMessage,
    handleError,
  } = useGetTodos(USER_ID, makeAnyChange);

  const handleSelectedTodo = (value: number[]) => {
    setSelectedTodo(value);
  };

  const handleSetTempTodo = (value:Todo | null) => {
    setTempTodo(value);
  };

  const handleSetMakeAnyChange = (value:boolean) => {
    setMakeAnyChange(value);
  };

  const handleDeleteUptadeTodo = (value: boolean) => {
    setIsDeleteUpdateTodo(value);
  };

  const todosNotCompleted = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos]);

  const deleteOneTodo = async (todoId: number) => {
    setSelectedTodo(prevSelectedTodo => [...prevSelectedTodo, todoId]);
    setIsDeleteUpdateTodo(true);
    try {
      await deleteTodo(USER_ID, todoId);
    } catch (error) {
      handleError(Errors.delete);
    } finally {
      setSelectedTodo([]);
    }

    setIsDeleteUpdateTodo(false);
    setMakeAnyChange(!makeAnyChange);
  };

  const updateCheckTodo = async (todoId: number) => {
    setSelectedTodo(prevSelectedTodo => [...prevSelectedTodo, todoId]);
    setIsDeleteUpdateTodo(true);
    let updatedTodo: Todo | undefined = todos.find(todo => todo.id === todoId);

    updatedTodo
      ? updatedTodo = { ...updatedTodo, completed: !updatedTodo.completed }
      : null;

    try {
      await updateTodo(USER_ID, updatedTodo, todoId);
    } catch (error) {
      handleError(Errors.update);
    } finally {
      setSelectedTodo([]);
    }

    setIsDeleteUpdateTodo(true);
    setMakeAnyChange(!makeAnyChange);
  };

  const handleUpdateCheckTodo = (value: number) => updateCheckTodo(value);
  const handleDeleteTodo = (value: number) => deleteOneTodo(value);

  const handleSetSortBy = (value: SortBy) => {
    setSortBy(value);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosNotCompleted={todosNotCompleted}
          todos={todos}
          handleUpdateCheckTodo={handleUpdateCheckTodo}
          handleSelectedTodo={handleSelectedTodo}
          handleError={handleError}
          handleSetTempTodo={handleSetTempTodo}
          userId={userId}
          handleSetMakeAnyChange={handleSetMakeAnyChange}
          makeAnyChange={makeAnyChange}
          selectedTodo={selectedTodo}
        />

        <Todos
          todos={todos}
          tempTodo={tempTodo}
          sortBy={sortBy}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          selectedTodo={selectedTodo}
          handleUpdateCheckTodo={handleUpdateCheckTodo}
          handleSelectedTodo={handleSelectedTodo}
          handleError={handleError}
          userId={userId}
          handleSetMakeAnyChange={handleSetMakeAnyChange}
          makeAnyChange={makeAnyChange}
          isDeleteUpdateTodo={isDeleteUpdateTodo}
          handleDeleteUptadeTodo={handleDeleteUptadeTodo}
        />

        {todos.length > 0 && (
          <Footer
            todosNotCompleted={todosNotCompleted}
            handleSetSortBy={handleSetSortBy}
            sortBy={sortBy}
            todos={todos}
            handleDeleteTodo={handleDeleteTodo}
            handleSelectedTodo={handleSelectedTodo}
            selectedTodo={selectedTodo}
          />
        )}

      </div>

      <div
        className={errorMessage
          ? 'notification is-danger is-light has-text-weight-normal'
          : 'notification is-danger is-light has-text-weight-normal hidden'}
      >
        <button
          type="button"
          className="delete"
          onClick={() => handleError(Errors.noEroor)}
        />

        {errorMessage}
      </div>
    </div>
  );
};

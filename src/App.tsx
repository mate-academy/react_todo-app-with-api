/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { updateTodo, USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import ErrorNotifacations from './components/ErrorNotifacations';
import Footer from './components/Footer';
import TodoList from './components/TodoList';
import Header from './components/Header';
import { Todo } from './types/Todo';
import { filterData } from './helpers/filterData';
import { ErrorMesagges, FilterOptions } from './types/enums';
import { deleteTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState<ErrorMesagges>(
    ErrorMesagges.defaultValue,
  );
  const [filterTypeValue, setFilterTypeValue] = useState<FilterOptions>(
    FilterOptions.All,
  );

  const [deletingIds, setDeletingIds] = useState<number[] | []>([]);
  const [completedIds, setCompletedIds] = useState<number[] | []>([]);

  const [isLoadingIds, setIsLoadingIds] = useState<number[] | []>([]);

  const handleSetfilterType = (value: FilterOptions) => {
    setFilterTypeValue(value);
  };

  const filteredTodos = filterData(todos, filterTypeValue);

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage(ErrorMesagges.UnableLoad);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDelete = async (todoId: number) => {
    try {
      const response = await deleteTodos(todoId);

      if (response) {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      }
    } catch (e) {
      setErrorMessage(ErrorMesagges.UnableDelete);
    } finally {
      setDeletingIds([]);
    }
  };

  const completedItems = todos.filter(x => x.completed === true);
  const completedLength = completedItems.length;

  const handleDeleteCompleted = () => {
    completedItems.forEach(item => {
      handleDelete(item.id);
    });
  };

  const isAllTodosCompleted = todos.length > 0 && todos.every(t => t.completed);

  const toggleActiveStatus = async () => {
    if (!isAllTodosCompleted) {
      const updatedTodos = await Promise.all(
        todos.map(async todo => {
          if (!todo.completed) {
            await updateTodo(todo.id, { completed: true });

            return { ...todo, completed: true };
          }

          return todo;
        }),
      );

      setTodos(updatedTodos);
      setCompletedIds(
        updatedTodos.filter(todo => todo.completed).map(todo => todo.id),
      );
    } else {
      const updatedTodos = await Promise.all(
        todos.map(async todo => {
          if (todo.completed) {
            await updateTodo(todo.id, { completed: false });

            return { ...todo, completed: false };
          }

          return todo;
        }),
      );

      setTodos(updatedTodos);
      setCompletedIds(
        updatedTodos.filter(todo => todo.completed).map(todo => todo.id),
      );
    }
  };

  const notCompletedTodos = todos.filter(todo => !todo.completed).length;

  const handleToggle = (id: number, completed: boolean) => {
    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
          toggleActiveStatus={toggleActiveStatus}
          isAllTodosCompleted={isAllTodosCompleted}
          todos={todos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              filteredTodos={filteredTodos}
              tempTodo={tempTodo}
              onDelete={handleDelete}
              deletingIds={deletingIds}
              setDeletingIds={setDeletingIds}
              isAllTodosCompleted={isAllTodosCompleted}
              isCompletedIds={completedIds}
              isLoadingIds={isLoadingIds}
              setIsLoadingIds={setIsLoadingIds}
              onToggle={handleToggle}
              setErrorMessage={setErrorMessage}
              setTodos={setTodos}
            />
            <Footer
              filterTypeValue={filterTypeValue}
              onSetfilterType={handleSetfilterType}
              handleDeleteCompleted={handleDeleteCompleted}
              completedLength={completedLength}
              notCompletedTodos={notCompletedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotifacations
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

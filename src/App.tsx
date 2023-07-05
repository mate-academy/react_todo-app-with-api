import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodos, deleteTodos, getTodos, updateTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorTypes } from './types/ErrorTypes';
import { ErrorMessage } from './components/ErrorMessage';
import { FilterTypes } from './types/FilterTypes';
import { TodoItem } from './components/TodoItem';
import { Header } from './components/Header.tsx/Header';

const USER_ID = 10905;

export const App: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(FilterTypes.ALL);
  const [loadingTodosId, setLoadingTodosId] = useState<number[]>([0]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<ErrorTypes>();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const showAndDeleteError = () => {
    setIsError(true);

    return setTimeout(() => setIsError(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorTypes.TITLE);
      setTitle('');

      return showAndDeleteError();
    }

    setIsDisabled(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    addTodos({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then((res) => {
        setTodos(prevTodos => [...prevTodos, res]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.ADD);
        showAndDeleteError();
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
      });

    return setTitle('');
  };

  const filterTodos = (filterTodosBy: FilterTypes) => {
    switch (filterTodosBy) {
      case FilterTypes.ACTIVE:
        return todos.filter(todo => !todo.completed);

      case FilterTypes.COMPLETED:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodosId(prevTodos => [...prevTodos, todoId]);
    deleteTodos(todoId)
      .then(() => {
        setTodos(prevTodos => [...prevTodos
          .filter(todo => todo.id !== todoId)]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.DELETE);
        showAndDeleteError();
      })
      .finally(() => {
        setLoadingTodosId(prevLoadingTodos => [...prevLoadingTodos
          .filter(Id => Id !== todoId)]);
      });
  };

  const handleTodoUpdate = (todoId: number, data: any) => {
    setLoadingTodosId(prevTodos => [...prevTodos, todoId]);
    updateTodos(todoId, data)
      .then((res) => {
        setTodos(prevTodos => [
          ...prevTodos.map(todo => {
            return todo.id === todoId ? res : todo;
          }),
        ]);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.UPDATE);
        showAndDeleteError();
      })
      .finally(() => {
        setLoadingTodosId(prevLoadingTodos => [...prevLoadingTodos
          .filter(Id => Id !== todoId)]);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.LOAD);
        showAndDeleteError();
      });

    return () => {
      setIsError(false);
      clearTimeout(showAndDeleteError());
    };
  }, []);

  const visibleTodos = useMemo(() => {
    return filterTodos(selectedFilter);
  }, [selectedFilter, todos]);

  const todosLeftToFinish = useMemo(() => {
    return filterTodos(FilterTypes.ACTIVE);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isDisabled={isDisabled}
          handleTodoUpdate={handleTodoUpdate}
          handleChangeTitle={handleChangeTitle}
          handleSubmit={handleSubmit}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              visibleTodos={visibleTodos}
              loadingTodosId={loadingTodosId}
              handleDeleteTodo={handleDeleteTodo}
              handleTodoUpdate={handleTodoUpdate}
            />
            {tempTodo && (
              <TodoItem
                todo={tempTodo}
                loadingTodosId={loadingTodosId}
                handleDeleteTodo={handleDeleteTodo}
                handleTodoUpdate={handleTodoUpdate}
              />
            )}
            <Footer
              todos={todos}
              handleDeleteTodo={handleDeleteTodo}
              todosLeftToFinish={todosLeftToFinish}
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
            />
          </>
        )}
      </div>

      <ErrorMessage
        isError={isError}
        setIsError={setIsError}
        errorMessage={errorMessage}
      />
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as postService from './api/todos';
import { Status } from './types/Status';
import { Errors } from './components/Errors/Errors';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';

const USER_ID = 11098;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilterBy, setTodosFilterBy] = useState<Status>(
    Status.ALL,
  );
  const [isError, setIsError] = useState('');
  const [selectedId, setSelectedId] = useState(0);
  const [toggleAll, setToggleAll] = useState(true);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showError = (text: string) => {
    setIsError(text);
    setTimeout(() => {
      setIsError('');
    }, 2000);
  };

  useEffect(() => {
    postService
      .getTodos(USER_ID)
      .then((todo: Todo[]) => todo
        .map(tod => setTodos(prev => [tod, ...prev])))
      .catch(() => setIsError('Unable to load a todo'));
  }, []);

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setIsLoading(true);

    postService
      .createTodos(USER_ID, { userId, title, completed })
      .then((newTodo: Todo) => {
        setTodos((prevTodo) => [newTodo, ...prevTodo]);
        setSelectedId(newTodo.id);
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(true);
    setSelectedId(todoId);

    postService
      .deleteTodos(todoId)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter((todo) => todo.id !== todoId)))
      .catch(() => showError('Unable to deletion a todo'))
      .finally(() => {
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  const updateTodos = (todoId: number, data: Partial<Todo>) => {
    setIsLoading(true);
    setSelectedId(todoId);

    postService
      .updateTodos(todoId, data)
      .then((updateTodo) => {
        setTodos((prev) => prev
          .map((todo) => (todo.id === todoId ? updateTodo : todo)));
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setIsLoading(false);
        setToggleLoader(false);
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (todosFilterBy) {
        case Status.ACTIVE:
          return !todo.completed;

        case Status.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todosFilterBy, todos]);

  const isActiveTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handlerToggler = () => {
    setToggleAll(!toggleAll);
    setToggleLoader(true);

    return filteredTodos
      .forEach((todo) => updateTodos(todo.id, { completed: toggleAll }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          todos={todos}
          isActive={isActiveTodos.length}
          isLoading={setIsLoading}
          createTodo={addTodo}
          handlerToggler={handlerToggler}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              updateTodos={updateTodos}
              isLoading={isLoading}
              selectedId={selectedId}
              toggleLoader={toggleLoader}
            />

            <Footer
              todos={todos}
              filterBy={todosFilterBy}
              isActive={isActiveTodos}
              deleteTodo={deleteTodo}
              setFilterBy={setTodosFilterBy}
            />
          </>
        )}
      </div>

      {isError && <Errors error={isError} setIsError={setIsError} />}
    </div>
  );
};

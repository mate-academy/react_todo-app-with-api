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
    Status.All,
  );
  const [isError, setIsError] = useState('');
  const [selectedId, setSelectedId] = useState(0);
  const [toggleAll, setToggleAll] = useState(true);
  const [toggleLoader, setToggleLoader] = useState(false);
  const [updateLoadingState, setUpdateLoadingState] = useState(false);

  const showError = (text: string) => {
    setIsError(text);
    setTimeout(() => {
      setIsError('');
    }, 2000);
  };

  useEffect(() => {
    postService
      .getTodos(USER_ID)
      .then((todo: Todo[]) => {
        setTodos(todo);
      })
      .catch(() => setIsError('Unable to load todos'));
  }, []);

  const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
    setUpdateLoadingState(true);

    postService
      .createTodo(USER_ID, { userId, title, completed })
      .then((newTodo: Todo) => {
        setTodos((prevTodo) => [newTodo, ...prevTodo]);
        setSelectedId(newTodo.id);
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setUpdateLoadingState(false);
        setToggleLoader(false);
      });
  };

  const deleteTodo = (todoId: number) => {
    setUpdateLoadingState(true);
    setSelectedId(todoId);

    postService
      .deleteTodo(todoId)
      .then(() => setTodos((currentTodos) => currentTodos
        .filter((todo) => todo.id !== todoId)))
      .catch(() => showError('Unable to deletion a todo'))
      .finally(() => {
        setUpdateLoadingState(false);
        setToggleLoader(false);
      });
  };

  const updateTodos = (todoId: number, data: Partial<Todo>) => {
    setUpdateLoadingState(true);
    setSelectedId(todoId);

    postService
      .updateTodo(todoId, data)
      .then((updateTodo) => {
        setTodos((prev) => prev
          .map((todo) => (todo.id === todoId ? updateTodo : todo)));
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setUpdateLoadingState(false);
        setToggleLoader(false);
      });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (todosFilterBy) {
        case Status.Active:
          return !todo.completed;

        case Status.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todosFilterBy, todos]);

  const activeTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handlerToggler = async () => {
    setToggleAll(!toggleAll);
    setToggleLoader(true);

    await Promise.all(filteredTodos.map(
      todo => updateTodos(todo.id, { completed: toggleAll }),
    ));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          showError={showError}
          todos={todos}
          activeTodos={activeTodos.length}
          setUpdateLoadingState={setUpdateLoadingState}
          createTodo={addTodo}
          handlerToggler={handlerToggler}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={deleteTodo}
              updateTodos={updateTodos}
              isLoading={updateLoadingState}
              selectedId={selectedId}
              toggleLoader={toggleLoader}
            />

            <Footer
              todos={todos}
              filterBy={todosFilterBy}
              activeTodos={activeTodos}
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

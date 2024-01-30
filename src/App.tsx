/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Footer } from './components/footer/Footer';
import { Todo } from './types/Todo';
import { deleteTodo, getTodos, updateTodo } from './api/todos';
import { Header } from './components/header/Header';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './types/TodoFelter';
import { ErrorNotification } from './components/ErrorNotification';
import { Error } from './types/Error';

const USER_ID = 11960;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentFilter, setCurrentFilter]
    = useState<TodoFilter>(TodoFilter.All);
  const [errorText, setErrorText] = useState<Error>(Error.Default);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loaderTodoId, setLoaderTodoId] = useState<number[] | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorText(Error.CantLoad));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (currentFilter) {
      case TodoFilter.Active:
        return todos.filter(todo => !todo.completed);

      case TodoFilter.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [todos, currentFilter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleNewTodo = (todo: Todo) => {
    setTodos(current => [...current, todo]);
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoaderTodoId([todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => setErrorText(Error.Delete))
      .finally(() => setLoaderTodoId(null));
  };

  const toggleAllStatus = () => {
    let status = true;

    if (todos.filter(item => item.completed).length < todos.length) {
      status = false;
    }

    return status;
  };

  const handleDeleteCompleted = async (todosId: number[]) => {
    try {
      setLoaderTodoId(todosId);
      for (let i = 0; i < todosId.length; i += 1) {
        deleteTodo(todosId[i]);
      }
    } catch (error) {
      setErrorText(Error.Delete);
    } finally {
      setLoaderTodoId(null);
      setTodos(current => current.filter(todo => !todosId.includes(todo.id)));
    }
  };

  const handleUpdateAll = () => {
    const status = !toggleAllStatus();

    const currentTodos = [...todos];

    setLoaderTodoId(
      currentTodos
        .filter((todo) => todo.completed !== status)
        .map((todo) => todo.id),
    );

    for (let i = 0; i < currentTodos.length; i += 1) {
      if (currentTodos[i].completed !== status) {
        currentTodos[i].completed = status;

        updateTodo(currentTodos[i])
          .then(() => {
            setTodos(current => current.map(todo => {
              if (todo.id === currentTodos[i].id) {
                return currentTodos[i];
              }

              return todo;
            }));
          })
          .catch(() => {
            setErrorText(Error.Update);
          });
      }
    }

    setLoaderTodoId(null);
  };

  const handleUpdateTodo = (todo: Todo) => {
    setTodos(currentTodos => {
      const newTodos = [...currentTodos];
      const index = newTodos.findIndex(item => item.id === todo.id);

      newTodos.splice(index, 1, todo);

      return newTodos;
    });

    setLoaderTodoId(null);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodo={handleNewTodo}
          setTempTodo={setTempTodo}
          idUser={USER_ID}
          toggleAllStatus={toggleAllStatus()}
          setErrorMessege={setErrorText}
          UpdateAll={handleUpdateAll}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={filteredTodos}
              deleteTodo={handleDeleteTodo}
              loaderTodoId={loaderTodoId}
              setLoaderTodoId={setLoaderTodoId}
              tempTodo={tempTodo}
              setErrorText={setErrorText}
              TodoUpdate={handleUpdateTodo}
            />
            <Footer
              todos={filteredTodos}
              setFilter={setCurrentFilter}
              filterType={currentFilter}
              cleanComplitedTodo={handleDeleteCompleted}
            />
          </>
        )}
      </div>
      <ErrorNotification errorText={errorText} key={errorText} />
    </div>
  );
};

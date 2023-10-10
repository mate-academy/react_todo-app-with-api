/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Filter, Todo } from './types/Todo';
import * as todosService from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { TempTodo } from './components/TempTodo';

const USER_ID = 11641;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState<Filter>(Filter.all);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [hideNotification, setHideNotification] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const filteredTodos = todos.filter((todo) => todo.completed);

    setQuantity(todos.length - filteredTodos.length);
  }, [todos]);

  useEffect(() => {
    setErrorMessage('');
    todosService
      .getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    const filteredByTodos = todos.length
      ? todos.filter((todo) => {
        switch (filterBy) {
          case Filter.active:
            return !todo.completed;
          case Filter.completed:
            return todo.completed;
          default:
            return true;
        }
      })
      : [];

    return filteredByTodos;
  }, [filterBy, todos]);

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setIsFocused(false);

    return todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos) => currentTodos
          .filter((todo) => todo.id !== todoId));
      })
      .catch((error) => {
        setErrorMessage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setIsFocused(true);
      });
  };

  const createNewTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
    setErrorMessage('');

    return todosService
      .addTodo({ title, completed, userId })
      .then((newTodo: Todo) => {
        setTodos((currentTodos) => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage('Unable to add a todo');
        throw error;
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setErrorMessage('');

    return todosService
      .updateTodo(updatedTodo)
      .then((todo) => {
        setTodos((currentTodos) => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            (post) => post.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage('Unable to update a todo');
        throw error;
      });
  };

  const searchCompletedTodos = () => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  };

  const deleteCompletedTodos = () => {
    setErrorMessage('');
    if (hasCompleted) {
      setIsFocused(false);
      const arrWithId = todos
        .filter((todo) => todo.completed)
        .map((id) => id.id);

      arrWithId.map(async (id) => {
        return todosService.deleteTodo(id)
          .catch((e) => {
            setErrorMessage('Unable to delete a todo');
            throw e;
          })
          .then(() => {
            setTodos(todos.filter((todo) => !todo.completed));
          })
          .finally(() => setIsFocused(true));
      });
    }

    return 0;
  };

  useEffect(() => {
    const hasCompletedTodos = filteredTodos.some((todo) => todo.completed);

    setHasCompleted(hasCompletedTodos);
  }, [filteredTodos, hasCompleted]);

  useEffect(() => {
    setHideNotification(!errorMessage.length);
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div
      className="todoapp"
    >
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setTitle={setTodoTitle}
          title={todoTitle}
          addTodo={createNewTodo}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          todos={todos}
        />

        {!!todos.length && (
          <TodoList
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            todos={filteredTodos}
            searchCompletedTodos={searchCompletedTodos}
          />
        )}
        {!!tempTodo && <TempTodo tempTodo={tempTodo} />}

        {!!todos.length && (
          <Footer
            setFilterBy={setFilterBy}
            hasCompleted={hasCompleted}
            quantity={quantity}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        hideNotification={hideNotification}
        setHideNotification={setHideNotification}
        error={errorMessage}
      />
    </div>
  );
};

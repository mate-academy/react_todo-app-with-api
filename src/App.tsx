/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useContext,
  useState,
  useMemo,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { addTodo, getTodos, deleteTodo } from './api/todos';
import { ErrorNotification } from './types/ErrorNotification';
import { Error } from './components/Error';
import { TodoItem } from './components/TodoItem';
import { TodosContext } from './TodosContext';
import { Filter } from './types/Filter';

const USER_ID = 11988;

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    setTitle,
    tempTodo,
    setTempTodo,
    setIsInputDisabled,
    setIsLoader,
  } = useContext(TodosContext);

  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage]
    = useState<ErrorNotification>(ErrorNotification.Default);

  useEffect(() => {
    setErrorMessage(ErrorNotification.Default);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorNotification.LoadError));
  }, [setErrorMessage, setTodos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const createTodo = (newTodo: Omit<Todo, 'id'>) => {
    setErrorMessage(ErrorNotification.Default);

    addTodo(newTodo)
      .then((todo) => {
        setIsInputDisabled(true);
        setTempTodo({ id: 0, ...newTodo });
        setTodos([...todos, todo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorNotification.AddError);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsInputDisabled(false);
      });

    setTitle('');
  };

  const removeTodo = async (todo: Todo) => {
    setErrorMessage(ErrorNotification.Default);

    deleteTodo(todo.id)
      .then(() => setIsLoader(todo.id))
      .catch(() => {
        setErrorMessage(ErrorNotification.DeleteError);
        setIsLoader(null);
      })
      .finally(() => setTempTodo(null));

    setTodos(todos.filter(item => item.id !== todo.id));
  };

  const deleteSeveral = async () => {
    const deletePromises = todos
      .filter(todo => todo.completed)
      .map(todo => deleteTodo(todo.id));

    Promise.allSettled(deletePromises)
      .catch((error) => {
        setErrorMessage(ErrorNotification.DeleteError);
        throw error;
      })
      .finally(() => {
        const newTodos = todos.filter(todo => !todo.completed);

        setTodos(newTodos);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAdd={createTodo}
          userId={USER_ID}
          setErrorMessage={setErrorMessage}
        />
        {todos.length !== 0 && (
          <TodoList
            filteredTodos={filteredTodos}
            removeTodo={removeTodo}
            setErrorMessage={setErrorMessage}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            removeTodo={removeTodo}
            setErrorMessage={setErrorMessage}
            isTempTodo
          />
        )}

        {todos.length !== 0 && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            deleteCompleted={deleteSeveral}
          />
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

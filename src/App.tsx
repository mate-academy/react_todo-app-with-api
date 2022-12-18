/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { TodoList } from './components/TodoList/TodoList';
import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { ErrorType } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showFooter, setShowFooter] = useState(false);
  const [query, setQuery] = useState('');
  const [isDisabledInput, setIsDisableInput] = useState(false);
  const [error, setError] = useState<ErrorType>(ErrorType.None);
  const [loader, setLoader] = useState(false);
  const [focusedTodoId, setFocusetTodoId] = useState<number>(Infinity);
  const [toggleButton, setToggleButton] = useState<boolean>();
  const [togglerLoader, setTogglerLoader] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    const getTodosFromServer = async () => {
      const todosFromServer = user && await getTodos(user.id);

      try {
        if (user) {
          setTodos(await getTodos(user.id));
        }

        // condition to show footer
        if (todosFromServer && todosFromServer.length > 0) {
          setShowFooter(true);
        }

        if (todosFromServer && todosFromServer.some(todo => !todo.completed)) {
          setToggleButton(true);
        }
      } catch {
        setError(ErrorType.NoTodos);

        setTimeout(() => {
          setError(ErrorType.None);
        }, 3000);
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = async (todoData: Todo) => {
    try {
      setIsDisableInput(true);

      const newTodo = await addTodo(todoData);

      setTodos(previousTodos => ([
        ...previousTodos,
        newTodo,
      ]));

      setShowFooter(true);
      setIsDisableInput(false);
    } catch {
      setError(ErrorType.Add);
      setIsDisableInput(false);

      setTimeout(() => {
        setError(ErrorType.None);
      }, 3000);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoader(true);
      setFocusetTodoId(todoId);

      await removeTodo(todoId);

      const updatedTodos = todos.filter(todo => todo.id !== todoId);

      if (updatedTodos.length === 0) {
        setShowFooter(false);
      }

      setLoader(false);
      setTodos(updatedTodos);
    } catch {
      setError(ErrorType.Delete);
      setLoader(false);

      setTimeout(() => {
        setError(ErrorType.None);
      }, 3000);
    }
  };

  const changeTodo = async (todoId: number, todoData: Todo) => {
    try {
      setLoader(true);
      setFocusetTodoId(todoId);

      await updateTodo(todoId, todoData);
      const todosFromServer = user && await getTodos(user.id);

      if (todosFromServer) {
        setTodos(todosFromServer);
      }

      setLoader(false);
    } catch {
      setError(ErrorType.Update);
      setLoader(false);

      setTimeout(() => {
        setError(ErrorType.None);
      }, 3000);
    }
  };

  const toggleAll = async () => {
    try {
      setTogglerLoader(true);
      const todosFromServer = user && await getTodos(user.id);

      if (toggleButton && todosFromServer) {
        setToggleButton(false);

        setTodos(todosFromServer.map(todo => ({
          ...todo,
          completed: true,
        })));

        setTogglerLoader(false);

        todosFromServer.map(
          todo => updateTodo(todo.id, ({
            ...todo,
            completed: true,
          })),
        );
      }

      if (!toggleButton && todosFromServer) {
        setToggleButton(true);

        setTodos(todosFromServer.map(todo => ({
          ...todo,
          completed: false,
        })));

        setTogglerLoader(false);

        todosFromServer.map(
          todo => updateTodo(todo.id, ({
            ...todo,
            completed: false,
          })),
        );
      }
    } catch {
      setTogglerLoader(false);
      setError(ErrorType.Update);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          query={query}
          isDisabledInput={isDisabledInput}
          toggleButton={toggleButton}
          onQueryChange={setQuery}
          onErrorChange={setError}
          onAddNewTodo={addNewTodo}
          onToggleChange={toggleAll}
        />

        <TodoList
          todos={todos}
          focusedTodoId={focusedTodoId}
          loader={loader}
          togglerLoader={togglerLoader}
          onDeleteTodo={deleteTodo}
          onUpdateTodo={changeTodo}
        />

        {showFooter && (
          <Footer
            todos={todos}
            onTodosChange={setTodos}
            onShowFooterChange={setShowFooter}
          />
        )}
      </div>

      {error && (
        <ErrorNotification
          onErrorChange={setError}
          error={error}
        />
      )}
    </div>
  );
};

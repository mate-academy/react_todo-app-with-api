/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
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
  const [toggleButton, setToggleButton] = useState<boolean>(true);
  const [togglerLoader, setTogglerLoader] = useState(false);
  const [clearCompletedLoader, setClearCompletedLoader] = useState(false);

  const user = useContext(AuthContext);
  const {
    None,
    NoTodos,
    Update,
    Delete,
    Add,
  } = ErrorType;

  useEffect(() => {
    const getTodosFromServer = async () => {
      const todosFromServer = user && await getTodos(user.id);

      try {
        if (user) {
          setTodos(await getTodos(user.id));
        }

        if (todosFromServer && todosFromServer.length > 0) {
          setShowFooter(true);
        }

        if (todosFromServer && todosFromServer.every(todo => todo.completed)) {
          setToggleButton(true);
        }

        if (todosFromServer && todosFromServer.some(todo => !todo.completed)) {
          setToggleButton(false);
        }
      } catch {
        setError(NoTodos);

        setTimeout(() => {
          setError(None);
        }, 3000);
      }
    };

    getTodosFromServer();
  }, []);

  const addNewTodo = async (todoData: Todo) => {
    try {
      setIsDisableInput(true);
      setFocusetTodoId(todoData.id);
      setLoader(true);

      setTodos(previousTodos => ([
        ...previousTodos,
        todoData,
      ]));

      const newTodo = await addTodo(todoData);

      setTodos(todos.filter(todo => todo !== todoData));

      setTodos(previousTodos => ([
        ...previousTodos,
        newTodo,
      ]));

      setShowFooter(true);
      setIsDisableInput(false);
      setToggleButton(false);
    } catch {
      setError(Add);
      setIsDisableInput(false);

      setTimeout(() => {
        setError(None);
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
      setError(Delete);
      setLoader(false);

      setTimeout(() => {
        setError(None);
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
      setError(Update);
      setLoader(false);

      setTimeout(() => {
        setError(None);
      }, 3000);
    }
  };

  const toggleAll = async () => {
    try {
      setTogglerLoader(true);
      const todosFromServer = user && await getTodos(user.id);

      if (!toggleButton && todosFromServer) {
        todosFromServer.map(
          todo => updateTodo(todo.id, ({
            ...todo,
            completed: true,
          })),
        );

        setTodos(todos.map(todo => ({
          ...todo,
          completed: true,
        })));

        setToggleButton(true);
      }

      if (toggleButton && todosFromServer) {
        todosFromServer.map(
          todo => updateTodo(todo.id, ({
            ...todo,
            completed: false,
          })),
        );

        setTodos(todos.map(todo => ({
          ...todo,
          completed: false,
        })));

        setToggleButton(false);
      }

      setTogglerLoader(false);
    } catch {
      setTogglerLoader(false);
      setError(Update);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
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
          clearCompletedLoader={clearCompletedLoader}
          onDeleteTodo={deleteTodo}
          onUpdateTodo={changeTodo}
        />

        {showFooter && (
          <Footer
            todos={todos}
            onTodosChange={setTodos}
            onShowFooterChange={setShowFooter}
            onClearCompletedLoader={setClearCompletedLoader}
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

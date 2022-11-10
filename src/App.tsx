/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';
import { Filters } from './types/Filters';
import { getFilteredTodo } from './components/FilterTodo/FilterTodo';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/Error/ErrorMessage';
import { Error } from './types/Error';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

export const App: React.FC = () => {
  const user = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<Filters>(Filters.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number[]>([]);

  useEffect(() => {
    async function todosFromServer() {
      try {
        if (user) {
          const visibleTodos = getTodos(user.id);

          setTodos(await visibleTodos);
        }
      } catch (error) {
        setErrorMessage(`${error} ${user}`);
      }
    }

    todosFromServer();
  }, []);

  const filterTodoBy = getFilteredTodo(filterType, todos);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      return setErrorMessage('Title can`t be empty');
    }

    setIsAdding(true);

    if (user) {
      try {
        const newTodo = await createTodo(user.id, title);

        setTodos([...todos, newTodo]);
      } catch {
        setErrorMessage('Unable to add a todo');
      }
    }

    setIsAdding(false);

    return setTitle('');
  };

  const handleremoveTodo = async (todoId: number) => {
    setSelectedId([todoId]);
    setIsAdding(true);
    await deleteTodo(todoId);

    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    }

    setIsAdding(true);
  };

  const completedTodos = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const handleDeleteCompletedTodos = useCallback(() => {
    setCompletedTodosId([...completedTodos].map(({ id }) => id));

    Promise.any(completedTodos.map(({ id }) => handleremoveTodo(id)))
      .then(() => setTodos([...todos.filter(({ completed }) => !completed)]))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedId([]);
      });
  }, [todos, selectedId, errorMessage]);

  const toggleAll = todos.every(({ completed }) => completed);
  const activeTodos = todos.filter(({ completed }) => !completed);
  const isCompletedTodos = todos.some(({ completed }) => completed);

  const handleOnChange = useCallback(
    async (updateId: number, data: Partial<Todo>) => {
      try {
        const changeStatus: Todo = await updateTodo(updateId, data);

        setTodos(todos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorMessage(Error.NotUpdate);
      }
    }, [todos],
  );

  const handleClickToggleAll = () => {
    if (activeTodos.length) {
      activeTodos.map(({ id }) => updateTodo(id,
        { completed: true }).catch(() => (
        setErrorMessage(Error.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = true;

        return copy;
      }));
    } else {
      todos.map(({ id }) => updateTodo(id,
        { completed: false }).catch(() => (
        setErrorMessage(Error.NotUpdate))));
      setTodos(todos.map(todo => {
        const copy = todo;

        copy.completed = false;

        return copy;
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          setTitle={setTitle}
          todos={todos}
          title={title}
          handleSubmit={handleSubmit}
          toggleAll={toggleAll}
          handleToggleAll={handleClickToggleAll}
        />

        {(todos.length > 0) && (
          <>
            <TodoList
              todos={filterTodoBy}
              removeTodo={handleremoveTodo}
              selectedIds={selectedId}
              completedTodosId={completedTodosId}
              isAdding={isAdding}
              title={title}
              handleOnChange={handleOnChange}
            />

            <Footer
              sortBy={filterType}
              isCompleted={isCompletedTodos}
              activeTodos={activeTodos.length}
              setSortBy={setFilterType}
              deleteTodo={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>
      {errorMessage
          && (
            <ErrorMessage
              errorAlert={errorMessage}
              setErrorAlert={setErrorMessage}
            />
          )}
    </div>
  );
};

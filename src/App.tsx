import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ErrorNotification,
} from './components/ErrorNotification/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodosList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { getTodos, updateTodos } from './api/todos';
import { Error } from './types/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [errorNotification, setErrorNotification] = useState<string | null>('');
  const [title, setTitle] = useState('');
  const [selectedTodosIds, setSelectedTodosIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [toggle, setToggle] = useState(true);
  const user = useContext(AuthContext);

  const filteredTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;

        case FilterType.Completed:
          return completed;

        default:
          return true;
      }
    });
  }, [filterType, todos]);

  useEffect(() => {
    const getTodosFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch {
        setErrorNotification(Error.Load);
      }
    };

    if (!user) {
      return;
    }

    getTodosFromServer(user.id);
  }, []);

  const completedTodosIds = useMemo(
    () => todos.filter(({ completed }) => completed),
    [todos],
  );

  const handleOnChange = useCallback(
    async (updateId: number, data: Partial<Todo>) => {
      setSelectedTodosIds([updateId]);

      try {
        const changeStatus: Todo = await updateTodos(updateId, data);

        setTodos(prevTodos => prevTodos.map(todo => (
          todo.id === updateId
            ? changeStatus
            : todo
        )));
      } catch {
        setErrorNotification(Error.Update);
      }

      setSelectedTodosIds([]);
    }, [todos],
  );

  const handleClickToggle = async () => {
    if (completedTodosIds.length === todos.length) {
      setSelectedTodosIds(todos.map(todo => todo.id));
    } else {
      setSelectedTodosIds(todos.filter(todo => !todo.completed)
        .map(todo => todo.id));
    }

    try {
      const newTodos = await Promise.all(todos.map(todo => (
        todo.completed !== toggle
          ? updateTodos(todo.id, { completed: toggle })
          : todo
      )));

      setTodos(newTodos);
    } catch {
      setErrorNotification(Error.Update);
    }

    setToggle(!toggle);
    setSelectedTodosIds([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setTitle={setTitle}
          todos={todos}
          title={title}
          isAdding={isAdding}
          handleToggleAll={handleClickToggle}
          setIsAdding={setIsAdding}
          setErrorNotification={setErrorNotification}
          setTodos={setTodos}
          user={user}
        />
        {
          (isAdding || todos.length) > 0 && (
            <>
              <TodosList
                todos={filteredTodos}
                selectedTodosIds={selectedTodosIds}
                isAdding={isAdding}
                title={title}
                errorNotification={errorNotification}
                handleOnChange={handleOnChange}
                setErrorNotification={setErrorNotification}
                setSelectTodosIds={setSelectedTodosIds}
                setTodos={setTodos}
              />
              <Footer
                setFilterType={setFilterType}
                filterType={filterType}
                todos={todos}
                completeTodos={completedTodosIds}
                setSelectedTodosIds={setSelectedTodosIds}
                setTodos={setTodos}
                setErrorNotification={setErrorNotification}
                errorNotification={errorNotification}
                selectedTodosIds={selectedTodosIds}
              />
            </>
          )
        }
      </div>

      {errorNotification && (
        <ErrorNotification
          errorNotification={errorNotification}
          setErrorNotification={setErrorNotification}
        />
      )}
    </div>
  );
};

import React, {
  useEffect, useMemo, useContext, useState, useCallback, FormEvent,
} from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorNotification } from './components/ErrorNotification';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import {
  getTodos, addTodo, deleteTodo, updateTodo,
} from './api/todos';
import { FilterType } from './types/Filter';
import { ErrorMessage } from './types/Error';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [isSelectId, setIsSelectId] = useState<number[]>([]);

  useEffect(() => {
    const getTodoFromServer = async (userId: number) => {
      try {
        const todosFromServer = await getTodos(userId);

        setTodos(todosFromServer);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    };

    if (!user) {
      return;
    }

    getTodoFromServer(user.id);
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterType) {
        case FilterType.Active:
          return !todo.completed;

        case FilterType.Completed:
          return todo.completed;

        default:
          return todo;
      }
    });
  }, [todos, filterType]);

  const isActiveTodos = useMemo(() => {
    return todos.some(todo => !todo.completed);
  }, [todos]);

  const newTodo = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !user) {
      setErrorMessage(ErrorMessage.ErrorTitle);

      return;
    }

    setIsLoading(true);

    try {
      const addedTodo = await addTodo(title, user.id);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
    } catch {
      setErrorMessage(ErrorMessage.NotAdd);
    }

    setIsLoading(false);
    setTitle('');
  }, [user, title]);

  const removeTodo = useCallback(async (TodoId: number) => {
    setIsSelectId([TodoId]);

    try {
      await deleteTodo(TodoId);

      setTodos(prevTodos => prevTodos.filter(({ id }) => id !== TodoId));
    } catch {
      setErrorMessage(ErrorMessage.NotDelete);
    }
  }, [todos, errorMessage]);

  const completedTodo = useMemo(() => todos
    .filter(({ completed }) => completed), [todos]);

  const deleteTodoCompleted = useCallback(() => {
    setIsSelectId([...completedTodo].map(({ id }) => id));

    Promise.all(completedTodo.map(({ id }) => removeTodo(id)))
      .then(() => setTodos(prevTodos => prevTodos.filter(
        ({ completed }) => !completed,
      )))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotDelete);
        setIsSelectId([]);
      });
  }, [todos, setIsSelectId, errorMessage]);

  const changeStatus = useCallback(async (
    todoId: number,
    data: Partial<Todo>,
  ) => {
    setIsSelectId([todoId]);

    try {
      const changedTodo = await updateTodo(
        todoId,
        data,
      );

      setTodos(todos.map(todo => (
        todo.id === todoId
          ? changedTodo
          : todo
      )));
    } catch {
      setErrorMessage(ErrorMessage.NotUpdate);
    } finally {
      setIsSelectId([]);
    }
  }, [todos]);

  const changeAllStatus = () => {
    const isAllCompleted = todos.every(({ completed }) => completed);

    Promise.all(todos.map(({ id }) => changeStatus(id,
      { completed: !isAllCompleted })))
      .then(() => setTodos(todos.map(todo => ({
        ...todo,
        completed: !isAllCompleted,
      }))))
      .catch(() => {
        setErrorMessage(ErrorMessage.NotUpdate);
        setIsSelectId([]);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isActiveTodos={isActiveTodos}
          newTodo={newTodo}
          title={title}
          setTitle={setTitle}
          changeAllStatus={changeAllStatus}
        />
        {(todos.length > 0 || isLoading) && (
          <>
            <TodoList
              todos={filteredTodos}
              isLoading={isLoading}
              removeTodo={removeTodo}
              isSelectId={isSelectId}
              changeStatus={changeStatus}
            />
            <Footer
              filterType={filterType}
              handleFilter={setFilterType}
              todos={todos}
              deleteTodoCompleted={deleteTodoCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          handleError={setErrorMessage}
        />
      )}
    </div>
  );
};

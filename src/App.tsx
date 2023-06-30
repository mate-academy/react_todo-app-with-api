import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';

import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Header } from './Components/Header/Header';
import { TodoList } from './Components/TodoList/TodoList';
import { Footer } from './Components/Footer/Footer';
import { Todo } from './types/Todo';
import {
  deleteTodo, getTodos, postTodo, updateTodo,
} from './api/todos';
import { Error } from './types/Error';
import { Type } from './types/TodoTypes';

const USER_ID = 10788;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedType, setSelectedType] = useState(Type.All);
  const [isError, setIsError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoIdUpdate, setTodoIdUpdate] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos(USER_ID);

        setTodos(loadedTodos);
      } catch (error) {
        setIsError(Error.DOWNLOAD);
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (selectedType) {
      case Type.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Type.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, selectedType]);

  useEffect(() => {
    if (isError) {
      setIsError(isError);

      setTimeout(() => {
        setIsError(Error.NONE);
      }, 3000);
    }
  }, [isError]);

  const addTodo = useCallback(async (title: string) => {
    if (!title.trim()) {
      setIsError(Error.NOTITLE);
    }

    try {
      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
      };

      setIsLoading(true);

      setTempTodo({
        ...newTodo,
        id: 0,
      });

      const postedTodoToServer = await postTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, postedTodoToServer]);
    } catch (error) {
      setIsError(Error.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, [USER_ID, todos]);

  const removeTodo = useCallback(async (todoId: number) => {
    setTodoIdUpdate(state => [...state, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (error) {
      setIsError(Error.DELETE);
      setTodoIdUpdate([]);
    }
  }, [todos]);

  const completedTodos = todos.filter(todo => todo.completed);

  const removeCompletedTodos = useCallback(async () => {
    setTodoIdUpdate(completedTodos.map(todo => todo.id));

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(todos.filter(todo => !todo.completed));
    } catch (error) {
      setIsError(Error.DELETE);
    }
  }, [todos, todoIdUpdate]);

  const toggleTodo = useCallback(async (
    todoId: number, completed: boolean,
  ) => {
    setTodoIdUpdate(state => [...state, todoId]);

    try {
      await updateTodo(todoId, { completed });

      setTodos(state => state.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, completed };
        }

        return todo;
      }));
    } catch {
      setIsError(Error.UPDATE);
    } finally {
      setTodoIdUpdate(state => state.filter(todoItem => todoItem !== todoId));
      // setTodoIdUpdate([]);
    }
  }, [todos]);

  const allCompleted = useMemo(() => (
    todos.every(todo => todo.completed)
  ), [todos]);

  const toggleAllTodos = useCallback(async () => {
    try {
      await Promise.all(todos.map(todo => toggleTodo(todo.id, !allCompleted)));
    } catch (error) {
      setIsError(Error.UPDATE);
    }
  }, [todos, allCompleted]);

  // eslint-disable-next-line no-console
  console.log('qqqq');

  const changeName = async (
    todoId: number, NewTitle: string,
  ) => {
    // eslint-disable-next-line no-console
    console.log('aaaa');
    setTodoIdUpdate(state => [...state, todoId]);

    try {
      await updateTodo(todoId, { title: NewTitle });

      setTodos(state => state.map(todo => {
        if (todo.id === todoId) {
          return { ...todo, title: NewTitle };
        }

        return todo;
      }));
    } catch {
      setIsError(Error.UPDATE);
    } finally {
      setTodoIdUpdate(state => state.filter(todoItem => todoItem !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          setToggleAllTodos={toggleAllTodos}
          isLoading={isLoading}
        />
        <TodoList
          filteredTodos={filteredTodos}
          removeTodo={removeTodo}
          todoIdUpdate={todoIdUpdate}
          tempTodo={tempTodo}
          toggleCompletedTodo={toggleTodo}
          changeName={changeName}
        />
        {!!todos.length && (
          <Footer
            todos={todos}
            selectType={selectedType}
            setSelectedType={setSelectedType}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}
      </div>

      <div className={classNames(
        'notification is-danger is-light has-text-weight-normal',
        { hidden: isError === Error.NONE },
      )}
      >
        <button
          type="button"
          className="delete"
          aria-label="DeleteButton"
        />
        {isError}
      </div>
    </div>
  );
};

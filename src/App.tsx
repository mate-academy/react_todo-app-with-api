/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { FC, useState, useEffect, useMemo } from 'react';

import * as todosServices from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Filters } from './types/Filters';
import { Error } from './components/Error';

const USER_ID = 11839;

export const App: FC = () => {
  const [serverTodos, setServerTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(false);
  const [isloading, setIsLoading] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState(Filters.All);

  const changeErrorMessage = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const getTodos = async (userId: number) => {
    try {
      const todosData = await todosServices.getTodos(userId);

      setServerTodos(todosData);
    } catch (err) {
      changeErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    getTodos(USER_ID);
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    let filteredItems = serverTodos;

    switch (filterBy) {
      case Filters.Active:
        filteredItems = filteredItems.filter(todo => !todo.completed);
        break;

      case Filters.Completed:
        filteredItems = filteredItems.filter(todo => todo.completed);
        break;

      default:
        break;
    }

    return filteredItems;
  }, [serverTodos, filterBy]);

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      changeErrorMessage('Title should not be empty');

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setResponse(true);

    const createdTodo = await todosServices.createTodo(newTodo);

    try {
      setTitle('');
      setServerTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      changeErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setResponse(false);
    }
  };

  const deleteTodo = async (todoId: number) => {
    setIsLoading((currentTodo) => [...currentTodo, todoId]);
    try {
      await todosServices.deleteTodo(todoId);
      setServerTodos(
        (currentTodo) => currentTodo.filter((todo) => todo.id !== todoId),
      );
    } catch {
      changeErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoading(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todoId,
        ),
      );
    }
  };

  const updateTodo = async (todo: Todo) => {
    setIsLoading((currentTodo) => [...currentTodo, todo.id]);
    try {
      const updatedTodo = await todosServices.updateTodo({
        ...todo,
        completed: todo.completed,
      });

      setServerTodos(
        (currentTodo) => currentTodo.map((item) => (
          item.id === todo.id ? updatedTodo : item
        )),
      );
    } catch {
      changeErrorMessage('Unable to update a todo');
    } finally {
      setIsLoading(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todo.id,
        ),
      );
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={serverTodos}
          response={response}
          title={title}
          setTitle={setTitle}
          onHandleSubmit={addTodo}
          setTodos={setServerTodos}
          setFilterBy={setFilterBy}
        />

        {!!filteredTodos.length && (
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            isLoading={isloading}
            tempTodo={tempTodo}
          />
        )}

        {!!serverTodos.length && (
          <Footer
            todos={serverTodos}
            setTodos={setServerTodos}
            filter={filterBy}
            setFilterBy={setFilterBy}
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

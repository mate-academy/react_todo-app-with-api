/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FC,
  useState,
  useEffect,
} from 'react';

import * as todosServices from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Filters } from './types/Filters';
import { Error } from './components/Error';

const USER_ID = 11839;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState(false);
  const [isLoadingTodos, setIsLoadingTodos] = useState<number[]>([]);
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

      setTodos(todosData);
    } catch (err) {
      changeErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    getTodos(USER_ID);
  }, []);

  const deleteTodo = async (todoId: number) => {
    setIsLoadingTodos((currentTodos) => [...currentTodos, todoId]);
    try {
      await todosServices.deleteTodo(todoId);
      setTodos(
        (currentTodos) => currentTodos.filter((todo) => todo.id !== todoId),
      );
    } catch {
      changeErrorMessage('Unable to delete a todo');
      setTempTodo(null);
    } finally {
      setTempTodo(null);
      setResponse(false);
      setIsLoadingTodos(
        (currentTodos) => currentTodos.filter(
          (id: number) => id !== todoId,
        ),
      );
    }
  };

  const addTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        changeErrorMessage('Title should not be empty');

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title: normalizedTitle,
        completed: false,
        id: 0,
      };

      setTempTodo(newTodo);
      setResponse(true);
      const createdTodo = await todosServices.createTodo(newTodo);

      setTitle('');
      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch {
      changeErrorMessage('Unable to add a todo');
      setTempTodo(null);
      setResponse(false);

      return;
    } finally {
      setTempTodo(null);
      setResponse(false);
    }
  };

  const updateTodo = async (todo: Todo) => {
    setIsLoadingTodos((currentTodo) => [...currentTodo, todo.id]);
    try {
      const updatedTodo = await todosServices.updateTodo({
        ...todo,
        completed: todo.completed,
      });

      setTodos(
        (currentTodo) => currentTodo.map((item) => (
          item.id === todo.id ? updatedTodo : item
        )),
      );
    } catch {
      changeErrorMessage('Unable to update a todo');
      setTempTodo(null);
    } finally {
      setTempTodo(null);
      setResponse(false);
      setIsLoadingTodos(
        (currentTodo) => currentTodo.filter(
          (id: number) => id !== todo.id,
        ),
      );
    }
  };

  const toggleAll = async () => {
    try {
      const allTodosCompleted = todos.every(todo => todo.completed);

      setFilterBy(Filters.Toggled);
      const todosToUpdate = todos.map(todo => ({
        ...todo,
        completed: !allTodosCompleted,
      }));

      await Promise.all(todosToUpdate.map(todo => updateTodo(todo)));
      setTodos(todosToUpdate);
    } catch {
      changeErrorMessage('Unable to toggle todos');
      setTodos(todos);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          response={response}
          title={title}
          setTitle={setTitle}
          onHandleSubmit={addTodo}
          toggleAll={toggleAll}
        />

        {!!todos.length && (
          <TodoList
            todos={todos}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
            isLoadingTodos={isLoadingTodos}
            tempTodo={tempTodo}
            filterBy={filterBy}
            changeErrorMessage={changeErrorMessage}
          />
        )}

        {!!todos.length && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filterBy}
            setFilterBy={setFilterBy}
            changeErrorMessage={changeErrorMessage}
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

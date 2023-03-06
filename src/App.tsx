/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  changeTodo,
} from './api/todos';
import { ErrorMessage } from './components/Error';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/todosList';
import { Error } from './types/Error';
import { Status } from './types/Status';
import { ChangeField, Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6366;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [error, setError] = useState<Error>(Error.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosInProcess, setTodosInProcess] = useState<number[]>([]);

  const setErrorStatus = (newError: Error) => {
    setError(newError);

    setTimeout(() => {
      setError(Error.NONE);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setErrorStatus(Error.FETCH);
    }
  };

  const addNewTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      setErrorStatus(Error.FORM);

      return;
    }

    const todoToAdd = {
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...todoToAdd, id: 0 });

    try {
      await addTodo(USER_ID, todoToAdd);

      await fetchTodos();
    } catch {
      setErrorStatus(Error.ADD);
    } finally {
      setTempTodo(null);
    }
  };

  const deleteChosenTodo = async (todoId: number) => {
    setTodosInProcess((prevState) => [...prevState, todoId]);

    try {
      await deleteTodo(USER_ID, todoId);
      await fetchTodos();
    } catch {
      setErrorStatus(Error.DELETE);
    } finally {
      setTodosInProcess((current) => current.filter(id => id !== todoId));
    }
  };

  const changeChosenTodo = async (todoId: number, todoField: ChangeField) => {
    setTodosInProcess((prevState) => [...prevState, todoId]);

    try {
      await changeTodo(USER_ID, todoId, todoField);
      await fetchTodos();
    } catch {
      setErrorStatus(Error.CHANGE);
    } finally {
      setTodosInProcess((current) => current.filter(id => id !== todoId));
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const todosByStatus = useMemo(() => (
    status === Status.All
      ? todos
      : todos.filter(({ completed }) => (
        status === Status.COMPLETED ? completed : !completed
      ))
  ), [status, todos]);

  const activeCount = useMemo(() => (
    todos.reduce((acc, todo) => (
      todo.completed ? acc : acc + 1
    ), 0)
  ), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addNewTodo={addNewTodo}
          todos={todos}
          onChange={changeChosenTodo}
        />
        {
          todos.length !== 0 && (
            <>
              <TodoList
                todos={todosByStatus}
                onDelete={deleteChosenTodo}
                onChange={changeChosenTodo}
                tempTodo={tempTodo}
                todosInProcess={todosInProcess}
              />

              <Footer
                todos={todos}
                activeCount={activeCount}
                status={status}
                setStatus={setStatus}
                onDelete={deleteChosenTodo}
              />
            </>
          )
        }
      </div>
      <ErrorMessage error={error} onDeleteClick={setError} />
    </div>
  );
};

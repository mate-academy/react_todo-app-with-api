import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';

import { Todo } from './types/Todo';
import { Errors } from './types/Errors';
import { Status } from './types/Status';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { Notification } from './components/Notification';
import { TodoItem } from './components/TodoItem';

const USER_ID = 11713;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [todoLoaderIndex, setTodoLoaderIndex] = useState(0);

  const [loader, setLoader] = useState(true);
  const [statusResponce, setStatusResponce] = useState(false);

  const changeErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  const removeErrorMessage = () => setErrorMessage('');

  useEffect(() => {
    todosService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => changeErrorMessage(Errors.Load))
      .finally(() => setLoader(false));
  }, []);

  const activeTodosLength = [...todos]
    .filter(({ completed }) => !completed).length;

  const completedTodosLength = [...todos]
    .filter(({ completed }) => completed).length;

  const filteredTodos = useMemo(() => {
    switch (filterStatus) {
      case Status.active:
        return [...todos].filter(({ completed }) => !completed);
      case Status.completed:
        return [...todos].filter(({ completed }) => completed);
      default:
        return todos;
    }
  }, [todos, filterStatus]);

  const changeTodosStatus = (status: string) => {
    switch (status) {
      case Status.active:
        return setFilterStatus(Status.active);
      case Status.completed:
        return setFilterStatus(Status.completed);
      default:
        return setFilterStatus(Status.all);
    }
  };

  const addTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      changeErrorMessage(Errors.Title);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ id: 0, ...newTodo });
    setStatusResponce(true);

    todosService
      .createTodo(newTodo)
      .then((todo) => {
        setTodos((prevState) => [...prevState, todo]);
        setTitle('');
      })
      .catch(() => changeErrorMessage(Errors.Add))
      .finally(() => {
        setStatusResponce(false);
        setTempTodo(null);
      });
  };

  const updateTodo = (todo: Todo, editStatus: boolean) => {
    setTodoLoaderIndex(todo.id);
    setStatusResponce(true);

    todosService
      .updateTodo(editStatus ? todo : { ...todo, completed: !todo.completed })
      .then((changedTodo) => {
        setTodos((prevState) => {
          const newTodos = [...prevState];
          const index = newTodos.findIndex(({ id }) => id === todo.id);

          newTodos.splice(index, 1, changedTodo);

          return newTodos;
        });
      })
      .catch(() => changeErrorMessage(Errors.Update))
      .finally(() => {
        setStatusResponce(false);
        setTodoLoaderIndex(0);
      });
  };

  const updateAllTodos = () => {
    const activeTodos = [...todos].map((todo) => ({
      ...todo,
      completed: false,
    }));
    const completedTodos = [...todos].map((todo) => ({
      ...todo,
      completed: true,
    }));

    if (!activeTodosLength) {
      completedTodos.forEach((todo) => updateTodo(todo, false));

      return;
    }

    activeTodos.forEach((todo) => updateTodo(todo, false));
  };

  const removeTodo = (todoId: number) => {
    setLoader(true);

    todosService
      .removeTodo(todoId)
      .then(() => {
        setTodos((prevState) => prevState.filter(({ id }) => id !== todoId));
      })
      .catch(() => changeErrorMessage(Errors.Delete))
      .finally(() => setLoader(false));
  };

  const removeAllTodos = () => {
    const completedTodos = [...todos]
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    completedTodos.forEach((id) => removeTodo(id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          statusResponce={statusResponce}
          title={title}
          activeTodosLength={activeTodosLength}
          setTitle={setTitle}
          addTodo={addTodo}
          updateAllTodos={updateAllTodos}
        />

        {!loader && (
          <TodoList
            todos={filteredTodos}
            todoLoaderIndex={todoLoaderIndex}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
          />
        )}

        {!loader && tempTodo && (
          <TodoItem
            todo={tempTodo}
            todoLoaderIndex={todoLoaderIndex}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
          />
        )}

        {!loader && todos.length > 0 && (
          <TodoFooter
            activeTodosLength={activeTodosLength}
            completedTodosLength={completedTodosLength}
            filterStatus={filterStatus}
            changeTodosStatus={changeTodosStatus}
            removeAllTodos={removeAllTodos}
          />
        )}
      </div>

      <Notification
        errorMessage={errorMessage}
        removeErrorMessage={removeErrorMessage}
      />
    </div>
  );
};

/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { FilterTypes } from './types/FilterTypes';
import { ErrorTypes } from './types/ErrorTypes';

import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { RequestTodoBody } from './types/RequestTodo';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

const USER_ID = 10329;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes>(ErrorTypes.NoError);
  const [isError, setIsError] = useState(false);
  const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [inputDisable, setInputDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<RequestTodoBody | null>(null);
  const [waitForRequestTodoId, setwaitForRequestTodoId] = useState<number | null>(null);
  const [isWaitForRequestAll, setIsWaitForRequestAll] = useState(false);
  const [isEdit, setIsEdit] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const visibleTodos = useMemo(() => {
    const preperedTodos = [...todos];

    switch (filterType) {
      case FilterTypes.Active:
        return preperedTodos.filter(todo => !todo.completed);

      case FilterTypes.Complited:
        return preperedTodos.filter(todo => todo.completed);

      default:
        return preperedTodos;
    }
  }, [todos, filterType]);

  const hideNotification = () => {
    setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  const fetchTodos = async () => {
    try {
      const newTodos = await getTodos(USER_ID);

      setTodos(newTodos);
      setInputDisable(false);
    } catch (error1) {
      setError(ErrorTypes.UnableToShowTodos);
      setIsError(true);
      hideNotification();
    }
  };

  const handlerAddTodo = async () => {
    if (!todoTitle) {
      setError(ErrorTypes.UnableToAddTodo);
      setIsError(true);
      hideNotification();

      return;
    }

    setInputDisable(true);
    const newData = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTodoTitle('');

    setTempTodo(newData);

    try {
      setIsError(false);
      await createTodo(USER_ID, newData);
      await fetchTodos();
    } catch (error2) {
      setError(ErrorTypes.UnableToAddTodo);
      setIsError(true);
      hideNotification();
    }

    setTempTodo(null);
  };

  const handlerDeleteTodo = async (todoId: number) => {
    setwaitForRequestTodoId(todoId);

    try {
      await deleteTodo(todoId);
      fetchTodos();
    } catch (error3) {
      setError(ErrorTypes.UnableToDeleteTodo);
      setIsError(true);
      setIsEdit(null);
      hideNotification();
      setwaitForRequestTodoId(null);
    }
  };

  const handlerDeleteCompletedTodos = async () => {
    setIsWaitForRequestAll(true);

    const promisesArr = [];

    for (const todo of todos) {
      if (todo.completed) {
        promisesArr.push(deleteTodo(todo.id));
      }
    }

    try {
      await Promise.all(promisesArr);
      fetchTodos();
    } catch (error3) {
      setError(ErrorTypes.UnableToDeleteTodo);
      setIsError(true);
      setIsEdit(null);
      hideNotification();
      setwaitForRequestTodoId(null);
    }

    setIsWaitForRequestAll(false);
  };

  const handlerUpdateTodoStatus = async (todoId: number, currStatus: boolean) => {
    setwaitForRequestTodoId(todoId);

    const updateData = {
      completed: !currStatus,
    };

    try {
      await updateTodo(todoId, updateData);
      fetchTodos();
    } catch (error4) {
      setError(ErrorTypes.UnableToUpdateTodo);
      setIsError(true);
      hideNotification();
    }

    setwaitForRequestTodoId(null);
  };

  const handlerUpdateTodoTitle = async (todoId: number) => {
    if(!editTitle) {
      handlerDeleteTodo(todoId);

      return;
    }

    setwaitForRequestTodoId(todoId);

    const updateData = {
      title: editTitle,
    };

    try {
      await updateTodo(todoId, updateData);
      fetchTodos();
    } catch (error4) {
      setError(ErrorTypes.UnableToUpdateTodo);
      setIsError(true);
      hideNotification();
    }

    setwaitForRequestTodoId(null);
    setIsEdit(null);
  };

  const handlerToggleAll = async () => {
    setIsWaitForRequestAll(true);

    const isCompleted = todos.every(todo => todo.completed === true);

    const updateData = {
      completed: !isCompleted,
    }

    const promisesArr = [];

    for (const todo of todos) {
      promisesArr.push(updateTodo(todo.id, updateData))
    }

    try {
      await Promise.all(promisesArr);
      fetchTodos();
    } catch (error4) {
      setError(ErrorTypes.UnableToUpdateTodo);
      setIsError(true);
      hideNotification();
    }

    setIsWaitForRequestAll(false);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header 
          todos={todos} 
          handlerToggleAll={handlerToggleAll}
          handlerAddTodo={handlerAddTodo}
          inputDisable={inputDisable}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
        />

        <Main
          visibleTodos={visibleTodos}
          handlerUpdateTodoStatus={handlerUpdateTodoStatus}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          handlerUpdateTodoTitle={handlerUpdateTodoTitle}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          handlerDeleteTodo={handlerDeleteTodo}
          waitForRequestTodoId={waitForRequestTodoId}
          isWaitForRequestAll={isWaitForRequestAll}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            handlerDeleteCompletedTodos={handlerDeleteCompletedTodos}
          />
        )}
      </div>

      <div className={classNames('notification is-danger is-light has-text-weight-normal',
      { hidden: !isError })}>
        <button
          type="button"
          className="delete"
          onClick={hideNotification}
        />
        {error}
      </div>
    </div>
  );
};

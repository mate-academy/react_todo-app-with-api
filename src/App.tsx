/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { Select } from './types/Select';
import { Todo } from './types/Todo';
import { TodoData } from './types/TodoData';
import { client, todoUrlEnd } from './utils/fetchClient';
import {
  createTodo,
  deleteTodo,
  changeTodoStatus,
  changeTodoTitle,
} from './api/todos';

const USER_ID = 10364;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [select, setSelect] = useState(Select.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getTodos = useCallback(async () => {
    const data: Todo[] = await client.get(todoUrlEnd);

    setTodos(data);
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  const addTodo = useCallback(async (data: TodoData) => {
    try {
      setIsLoading(true);
      await createTodo(data);
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      getTodos();
      setIsLoading(false);
    }
  }, []);

  const updateTodoStatus = useCallback(async (
    id: number,
    completed: boolean,
  ) => {
    try {
      setIsLoading(true);
      await changeTodoStatus(id, { completed });
    } catch {
      setErrorMessage('Unable to change a todo');
    } finally {
      getTodos();
      setIsLoading(false);
    }
  }, []);

  const updateTodoTitle = useCallback(async (
    id: number,
    title: string,
  ) => {
    try {
      setIsLoading(true);
      await changeTodoTitle(id, { title });
    } catch {
      setErrorMessage('Unable to change a todo');
    } finally {
      getTodos();
      setIsLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (id: number) => {
    await deleteTodo(id);
    getTodos();
  }, []);

  const handleSelectedTodos = useMemo(() => {
    let visibleTodos: Todo[] = [...todos];

    switch (select) {
      case Select.Active:
        visibleTodos = visibleTodos.filter(todo => todo.completed === false);
        break;

      case Select.Completed:
        visibleTodos = visibleTodos.filter(todo => todo.completed === true);
        break;

      case Select.All:
      default:
        break;
    }

    return visibleTodos;
  }, [todos, select]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          handleError={setErrorMessage}
          isLoading={isLoading}
        />
        <TodoList
          todos={handleSelectedTodos}
          onRemove={removeTodo}
          onChange={updateTodoStatus}
          onRename={updateTodoTitle}
        />

        {todos.length !== 0 && (
          <Footer
            onSelect={setSelect}
            todos={handleSelectedTodos}
            select={select}
          />
        )}
      </div>
      {errorMessage && (
        <Notification
          message={errorMessage}
          handleError={setErrorMessage}
        />
      )}
    </div>
  );
};

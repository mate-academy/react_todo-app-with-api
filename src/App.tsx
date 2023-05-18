/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

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
  changeTodo,
} from './api/todos';
import { TodoUpdate } from './types/todoUpdate';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [select, setSelect] = useState(Select.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  const activeTodos = todos.filter(({ completed }) => completed === false);
  const completedTodos = todos.filter(({ completed }) => completed === true);

  const getTodos = useCallback(async () => {
    const data: Todo[] = await client.get(todoUrlEnd);

    setTodos(data);
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

  const updateTodo = useCallback(async (todoId: number, data: TodoUpdate) => {
    try {
      setIsLoading(true);
      setLoadingTodoId(prevId => [...prevId, todoId]);
      await changeTodo(todoId, data);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      getTodos();
      setIsLoading(false);
      setLoadingTodoId([]);
    }
  }, []);

  const toggleAll = async () => {
    if (allCompleted) {
      todos.map(todo => updateTodo(todo.id, { completed: false }));

      setAllCompleted(false);
    } else {
      todos.map(todo => updateTodo(todo.id, { completed: true }));
      setAllCompleted(true);
    }
  };

  const removeTodo = useCallback(async (id: number) => {
    setLoadingTodoId(prevId => [...prevId, id]);
    await deleteTodo(id);
    getTodos();
    setLoadingTodoId([]);
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

  useEffect(() => {
    const allCompletedTodos = todos.every((todo) => todo.completed);

    setAllCompleted(allCompletedTodos);
  }, [todos]);

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          addTodo={addTodo}
          handleError={setErrorMessage}
          isLoading={isLoading}
          toggleAll={toggleAll}
        />
        <TodoList
          todos={handleSelectedTodos}
          onRemove={removeTodo}
          onChange={updateTodo}
          loadingTodoId={loadingTodoId}

        />

        {todos.length !== 0 && (
          <Footer
            onSelect={setSelect}
            activeTodos={activeTodos}
            select={select}
            completedTodos={completedTodos}
            onRemove={removeTodo}
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

/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import debounce from 'lodash.debounce';

import classNames from 'classnames';
import {
  addTodo,
  deleteTodo,
  getTodos,
  upgradeTodo,
} from './api/todos';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { Todo } from './types/Todo';
import { filterTodos } from './utils/filterTodos';
import { Footer } from './components/Footer';
import { FilterBy } from './types/FilterBy';
import { NewTodoForm } from './components/NewTodoForm';

const USER_ID = 6408;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState(FilterBy.all);
  const [isError, setIsError] = useState(false);
  const [typeError, setTypeError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);

  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);

  const countTodos = todos.length - completedTodos.length;

  const visibleData = useMemo(() => (
    filterTodos(todos, filterBy)
  ), [todos, filterBy]);

  const clearError = useCallback(debounce(() => setIsError(false), 3000), []);

  const pushError = useCallback((message: string) => {
    setIsError(true);
    setTypeError(message);
    clearError();
  }, []);

  const getTodosFromServer = async () => {
    try {
      const todosFromServer = await getTodos(6408);

      setTodos(todosFromServer);
    } catch {
      pushError('Unable to upload a todo');
    }
  };

  const addTodosOnServer = async (query: string) => {
    if (!query.trim()) {
      pushError('Title can\'t be empty');

      return;
    }

    try {
      const todo = {
        id: 0,
        title: query,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo(todo);

      await addTodo(USER_ID, query);
      await getTodosFromServer();
    } catch {
      pushError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodoFromServer = async (id: number) => {
    try {
      const selectTodo = todos.find(t => t.id === id);

      if (selectTodo) {
        setTempTodos((current) => ([...current,
          selectTodo]));
      }

      await deleteTodo(id);
      await getTodosFromServer();
    } catch {
      pushError('Unable to delete a todo');
    } finally {
      setTempTodos([]);
    }
  };

  const upgradeTodoFromServer = async (todo: Todo) => {
    try {
      setTempTodos((prev) => ([...prev, todo]));
      await upgradeTodo(todo);

      await getTodosFromServer();
    } catch {
      pushError('Unable to update a todo');
    } finally {
      setTempTodos([]);
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  const removeAllComplited = useCallback(() => {
    completedTodos.map(t => deleteTodoFromServer(t.id));
  }, [completedTodos]);

  const removeTodo = useCallback((id: number) => {
    deleteTodoFromServer(id);
  }, []);

  const handlerStatus = useCallback((todo: Todo) => {
    const updateTodo = {
      ...todo,
      completed: !todo.completed,
    };

    upgradeTodoFromServer(updateTodo);
  }, []);

  const handlerAllStatus = useCallback(() => {
    if (todos.length !== completedTodos.length) {
      const noCompletedTodos = todos.filter(todo => !todo.completed);

      return noCompletedTodos.map(todo => handlerStatus(todo));
    }

    return todos.map(todo => handlerStatus(todo));
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) },
              )}
              onClick={handlerAllStatus}
            />
          )}
          <NewTodoForm
            addTodosOnServer={addTodosOnServer}
          />
        </header>
        <TodoList
          todos={visibleData}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          removeTodo={removeTodo}
          handlerStatus={handlerStatus}
          upgradeTodoFromServer={upgradeTodoFromServer}
          deleteTodoFromServer={deleteTodoFromServer}
        />
        {todos.length > 0 && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            countTodos={countTodos}
            isCompleted={!!completedTodos.length}
            removeAllComplited={removeAllComplited}
          />
        )}

      </div>

      <Notification
        setIsError={setIsError}
        typeError={typeError}
        isError={isError}
      />
    </div>
  );
};

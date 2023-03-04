/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Notification } from './components/Notification/Notification';

import { Todo } from './types/Todo';

import {
  getTodos, addTodo, onDelete, onUpdate,
} from './api/todos';

const USER_ID = 6476;

export enum SortType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState('All');
  const [isError, setIsError] = useState(false);
  const [inputDisable, setInputDisable] = useState(false);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (filterBy) {
        case SortType.ALL:
          return todos;

        case SortType.ACTIVE:
          return !todo.completed;

        case SortType.COMPLETED:
          return todo.completed;

        default:
          return [];
      }
    })
    );
  }, [filterBy, todos]);

  const noCompleteTodos = todos.some((todo) => todo.completed);
  const isMustBeCompleted = todos.filter((todo) => !todo.completed).length;

  const loadTodosData = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTempTodo(null);

      setInputDisable(false);
      setIsError(false);

      setTodos(todosFromServer);
    } catch (error) {
      setIsError(true);
      setErrorMessage("Can't load data...");
    }
  };

  useEffect(() => {
    loadTodosData();
  }, []);

  const createNewTodo = (query: string) => {
    const newId = Math.max(...todos.map((todo) => todo.id + 1));

    const newTodo = {
      id: newId,
      userId: USER_ID,
      title: query,
      completed: false,
    };

    return newTodo;
  };

  const onCompletedChange = async (todo: Todo) => {
    try {
      await onUpdate(todo.id, {
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: !todo.completed,
      });

      setTempTodo(null);
      loadTodosData();
      setIsError(false);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
      setIsError(true);
    }
  };

  const dataTodo = {
    userId: USER_ID,
    title,
    completed: false,
  };

  const sendTodo = async () => {
    setTempTodo({ id: 0, ...dataTodo });

    try {
      if (title) {
        await addTodo(createNewTodo(title));
      } else {
        setIsError(true);
        setErrorMessage('Empty title alowed');
      }

      loadTodosData();
    } catch {
      setTempTodo(null);
      setErrorMessage('Unable to add a todo');
      setIsError(true);
      setInputDisable(false);
    }
  };

  const handleFromSubmit = (event: React.FormEvent) => {
    setInputDisable(true);

    event.preventDefault();

    sendTodo();
    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    try {
      await onDelete(todoId);
      loadTodosData();
    } catch (error) {
      setTempTodo(null);
      setIsError(true);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const toggleAllComlpleted = async () => {
    visibleTodos.map((todo) => {
      return onCompletedChange(todo);
    });
  };

  const clearCompleted = () => {
    const clearCompletedTodos = todos.filter((todo) => todo.completed);

    clearCompletedTodos.forEach((todo) => removeTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={handleFromSubmit}
          isDisabled={inputDisable}
          toggleAll={toggleAllComlpleted}
          noCompletedTodos={noCompleteTodos}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              isTemp={tempTodo}
              onRemoveTodo={removeTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodosData}
              setErrorMessage={setErrorMessage}
              setIsError={setIsError}
            />

            <Footer
              noCompleteTodos={noCompleteTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              clearCompleted={clearCompleted}
              leftTodos={isMustBeCompleted}
            />
          </>
        )}
      </div>

      {isError && (
        <Notification errorMessage={errorMessage} />
      )}

    </div>
  );
};

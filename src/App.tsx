/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
// eslint-disable-next-line import/no-cycle
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
  const [filterBy, setFilterBy] = useState(SortType.ALL);
  const [isInputDisable, setisInputDisable] = useState(false);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoadingTodosIds, setIsLoadingTodosIds] = useState<number[]>([]);

  const visibleTodos = useMemo(() => {
    return (todos.filter((todo) => {
      switch (filterBy) {
        case SortType.ALL:
          return todo;

        case SortType.ACTIVE:
          return !todo.completed;

        case SortType.COMPLETED:
          return todo.completed;

        default:
          return true;
      }
    })
    );
  }, [filterBy, todos]);

  const hasCompleteTodos = useMemo(() => {
    return todos.some((todo) => todo.completed);
  }, [todos]);

  const mustBeCompleted = todos.filter((todo) => !todo.completed).length;

  const loadTodosData = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTempTodo(null);
      setisInputDisable(false);
      setTodos(todosFromServer);
    } catch (error) {
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

      loadTodosData();
      setTempTodo(null);
    } catch (error) {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoadingTodosIds([]);
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
        setErrorMessage('Empty title alowed');
      }

      loadTodosData();
    } catch {
      setTempTodo(null);
      setErrorMessage('Unable to add a todo');
      setisInputDisable(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    setisInputDisable(true);

    event.preventDefault();

    sendTodo();
    setTitle('');
  };

  const removeTodo = async (todoId: number) => {
    setIsLoadingTodosIds(prevState => [...prevState, todoId]);

    try {
      await onDelete(todoId);
      loadTodosData();
    } catch (error) {
      setTempTodo(null);
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoadingTodosIds([]);
    }
  };

  const toggleAllComlpleted = () => {
    setIsLoadingTodosIds(visibleTodos.map((todo) => todo.id));

    visibleTodos.map((todo) => onCompletedChange(todo));
  };

  const clearCompleted = async () => {
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
          onSubmit={handleFormSubmit}
          isDisabled={isInputDisable}
          toggleAll={toggleAllComlpleted}
          hasCompletedTodos={hasCompleteTodos}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              isTemp={tempTodo}
              onRemoveTodo={removeTodo}
              onCompletedChange={onCompletedChange}
              loadTodos={loadTodosData}
              setErrorMessage={setErrorMessage}
              isLoadingTodosIds={isLoadingTodosIds}

            />

            <Footer
              hasCompleteTodos={hasCompleteTodos}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              clearCompleted={clearCompleted}
              leftTodos={mustBeCompleted}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <Notification errorMessage={errorMessage} />
      )}

    </div>
  );
};

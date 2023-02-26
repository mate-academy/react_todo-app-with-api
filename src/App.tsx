/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import {
  createTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';

const USER_ID = 6402;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodosLoaded, setIsTodosLoaded] = useState(false);
  const [temporaryTodo, setTemporatyTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState('');

  const isActiveTodo = todos.some((todo) => todo.completed);
  const todosAmount = todos.filter(todo => !todo.completed).length;

  const getTodoFromServer = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTemporatyTodo(null);
      setIsTodosLoaded(true);
      setTodos(todosFromServer);
    } catch (error) {
      setErrorMessage('Can`t load data from server');
    }
  };

  const createTodoOnServer = async (query: string) => {
    const data = {
      title: query,
      userId: USER_ID,
      completed: false,
    };

    setIsTodosLoaded(false);

    setTemporatyTodo({
      id: 0,
      ...data,
    });
    try {
      await createTodo(USER_ID, data);
      getTodoFromServer();
    } catch (error) {
      setTemporatyTodo(null);
      setErrorMessage('Unable to add a todo');
    }
  };

  const removeTodoOnServer = async (id: number) => {
    try {
      await deleteTodo(id);
      getTodoFromServer();
    } catch (error) {
      setTemporatyTodo(null);
      setErrorMessage('Unable to delete a todo');
    }
  };

  const updateTodoOnServer = async (todo: Todo, changeStatus?: boolean) => {
    const todoId = todo.id;
    const todoCopy = {
      ...todo,
    };

    if (changeStatus === true) {
      todoCopy.completed = !todo.completed;
    }

    try {
      await updateTodo(todoId, todoCopy);
      getTodoFromServer();
    } catch (error) {
      setTemporatyTodo(null);
      setErrorMessage('Unable to update a todo');
    }
  };

  const updateAllTodos = async () => {
    todos.forEach(todo => {
      updateTodoOnServer(todo, true);
    });
  };

  const clearCompleatedTodos = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      removeTodoOnServer(todo.id);
    });
  };

  const clearErrorMessage = () => {
    setErrorMessage('');
  };

  const visibleTodos = () => {
    const todosClone = todos;

    switch (filterBy) {
      case FilterBy.ACTIVE:
        return todosClone.filter(todo => todo.completed === false);

      case FilterBy.COMPLETED:
        return todosClone.filter(todo => todo.completed === true);

      case FilterBy.ALL:
        return todosClone;
      default:
        throw new Error('Unexpected filter type');
    }
  };

  useEffect(() => {
    getTodoFromServer();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos()}
          setErrorMessage={setErrorMessage}
          createTodoOnServer={createTodoOnServer}
          updateAllTodos={updateAllTodos}
          isTodosLoaded={isTodosLoaded}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={visibleTodos()}
              temporaryTodo={temporaryTodo}
              removeTodoOnServer={removeTodoOnServer}
              updateTodoOnServer={updateTodoOnServer}
            />
            <Footer
              filterBy={filterBy}
              setFilterBy={setFilterBy}
              isActiveTodo={isActiveTodo}
              clearCompleatedTodos={clearCompleatedTodos}
              todosAmount={todosAmount}
            />
          </>
        )}
      </div>
      {errorMessage
      && (
        <Notification
          errorMessage={errorMessage}
          clearErrorMessage={clearErrorMessage}
        />
      ) }
    </div>
  );
};

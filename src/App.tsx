/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';

import {
  getTodos, addTodo, deleteTodo, updateStatusTodo, updateTitleTodo,
} from './api/todos';

import { Todo } from './types/Todo';
import { SortType } from './types/SortType';

const USER_ID = 6650;

export const App: React.FC = () => {
  const [todosList, setTodosList] = useState<Todo[]>([]);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [sortType, setSortType] = useState(SortType.ALL);
  const [isDisabledForm, setIsDisabledForm] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [tempTodos, setTempTodos] = useState<Todo[]>([]);
  const [updatingTodo, setUpdatingTodo] = useState<Todo | null>(null);

  let visibleTodoList = todosList;
  const copletedTodos = todosList.filter(todo => todo.completed);
  const activeTodos = todosList.filter(todo => !todo.completed);
  const totalTodoListLength = todosList.length;
  const activeTodoListLength = activeTodos.length;
  const isActiveFooter = !!totalTodoListLength;
  const completedTodoListLength = totalTodoListLength - activeTodoListLength;

  switch (sortType) {
    case SortType.ACTIVE:
      visibleTodoList = todosList.filter(todo => !todo.completed);
      break;
    case SortType.COMPLETE:
      visibleTodoList = todosList.filter(todo => todo.completed);
      break;
    default:
      break;
  }

  // Show Error Message

  const showError = (value: string) => {
    setIsError(true);
    setErrorType(value);
    window.setTimeout(() => {
      setIsError(false);
    }, 3000);
  };

  // Get todos from server

  const getTodosFromServer = async () => {
    try {
      const todosData = await getTodos(USER_ID);

      setTodosList(todosData);
    } catch {
      setIsError(true);
      showError('loading error');
    }
  };

  useEffect(() => {
    getTodosFromServer();
  }, []);

  // Add new todo to server

  const addTodoOnServer = async () => {
    setIsDisabledForm(true);

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

      setQuery('');
      setTempTodo(null);
    } catch {
      setQuery('');
      showError('unable to add element');
    } finally {
      setIsDisabledForm(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query) {
      return showError('Title can\'t be empty');
    }

    return addTodoOnServer();
  };

  // Delete todo from server

  const deleteTodoFromServer = async (id:number) => {
    try {
      const selectedTodo = todosList.find(todo => todo.id === id);

      if (selectedTodo) {
        setTempTodos((prev) => [...prev, selectedTodo]);
      }

      await deleteTodo(id);
      await getTodosFromServer();
    } catch {
      showError('unable to delete element');
    } finally {
      setTempTodos([]);
    }
  };

  const removeTodo = (id:number) => {
    deleteTodoFromServer(id);
  };

  // Delete comleted todos from server

  const removeCompletedTodos = () => {
    copletedTodos.map(todo => deleteTodoFromServer(todo.id));
  };

  // Update todo on server

  const handleStatusTodo = async (id:number, completed:boolean) => {
    try {
      const newStatus = !completed;

      const processingTodo = visibleTodoList.find(todo => todo.id === id);

      if (processingTodo) {
        setUpdatingTodo(processingTodo);
      }

      await updateStatusTodo(id, newStatus);
      await getTodosFromServer();
    } catch {
      showError('unable to update a status');
    } finally {
      setUpdatingTodo(null);
    }
  };

  const handleAllTodosStatus = async () => {
    try {
      if (activeTodoListLength) {
        await Promise.all(activeTodos
          .map(todo => updateStatusTodo(todo.id, !todo.completed)));
      } else {
        await Promise.all(visibleTodoList
          .map(todo => updateStatusTodo(todo.id, !todo.completed)));
      }

      await getTodosFromServer();
    } catch {
      showError('unable to update all todo status');
    }
  };

  const handleTitleTodo = async (id:number, title:string) => {
    try {
      const processingTodo = visibleTodoList.find(todo => todo.id === id);

      if (processingTodo) {
        setUpdatingTodo(processingTodo);
      }

      await updateTitleTodo(id, title);
      await getTodosFromServer();
    } catch {
      showError('unable to update a title');
    } finally {
      setUpdatingTodo(null);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          totalTodoListLength={totalTodoListLength}
          query={query}
          onSetQuery={setQuery}
          isDisabledForm={isDisabledForm}
          handleSubmit={handleSubmit}
          onHandleAllTodosStatus={handleAllTodosStatus}
        />

        <TodoList
          todos={visibleTodoList}
          tempTodo={tempTodo}
          tempTodos={tempTodos}
          removeTodo={removeTodo}
          onHandleStatusTodo={handleStatusTodo}
          onHandleTitleTodo={handleTitleTodo}
          updatingTodo={updatingTodo}
        />

        {isActiveFooter && (
          <Footer
            sortType={sortType}
            onSetSortType={setSortType}
            activeTodoListLength={activeTodoListLength}
            completedTodoListLength={completedTodoListLength}
            removeCompletedTodos={removeCompletedTodos}
          />
        )}

      </div>

      <ErrorNotification
        isError={isError}
        setIsError={setIsError}
        errorType={errorType}
      />
    </div>
  );
};

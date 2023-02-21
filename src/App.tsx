/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useCallback, useEffect } from 'react';

// components
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer/Footer';
import { ErrorMessage } from './components/ErrorMessage';

// utils for loading and updating
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateStatusTodo,
  updateTitleTodo,
} from './api/todos';

// utils
import { getFilteredTodos } from './utils/getFilteredTodos';

// types
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';

const USER_ID = 6354;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosWithLoader, setTodosWithLoader] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoadingFailed, setIsLoadingFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);

  const visibleTodos = getFilteredTodos(todos, filterBy);
  const completedTodos = todos.filter(todo => todo.completed === true);

  const numberOfNotCompletedTodos = todos.length - completedTodos.length;
  const isClearAllButtonVisible = Boolean(!completedTodos.length);

  const isSubmitButtonDisabled = Boolean(tempTodo?.title.length);

  const addErrorMessage = useCallback((newMessage: string) => {
    setErrorMessage(newMessage);
  }, []);

  const getAllTodos = useCallback(async () => {
    setIsLoadingFailed(false);

    try {
      const allTodos = await getTodos(USER_ID);

      setTodos(allTodos);
    } catch {
      setIsLoadingFailed(true);
      addErrorMessage('Unable to update a todo');
    }
  }, []);

  useEffect(() => {
    getAllTodos();
  }, []);

  const clearMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  const addNewTodo = useCallback(async (title: string) => {
    clearMessage();

    if (!title) {
      addErrorMessage('Title can\'t be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    try {
      await addTodo(USER_ID, newTodo);
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to load todos');
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (todo: Todo) => {
    clearMessage();

    setTodosWithLoader(currentTodos => [...currentTodos, todo]);

    try {
      await deleteTodo(USER_ID, todo);
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to update a todo');
    } finally {
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(t => t.id !== todo.id)
      ));
    }
  }, []);

  const removeAllCompletedTodos = useCallback(async () => {
    clearMessage();

    setTodosWithLoader(currentTodos => [...currentTodos, ...completedTodos]);

    try {
      await Promise.all(
        completedTodos
          .map((todo: Todo) => deleteTodo(USER_ID, todo)),
      );
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to delete completed todos');
    } finally {
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(todo => todo.completed !== true)
      ));
    }
  }, [completedTodos]);

  const changeStatus = useCallback(async (todoChangeStatus: Todo) => {
    const newTodoStatus = !todoChangeStatus.completed;
    const todoIdChangeStatus = todoChangeStatus.id;

    setTodosWithLoader(currentTodos => [...currentTodos, todoChangeStatus]);

    try {
      await updateStatusTodo(todoIdChangeStatus, newTodoStatus);
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to update a todo');
    } finally {
      clearMessage();
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(t => t.id !== todoChangeStatus.id)
      ));
    }
  }, []);

  const changeTitle = useCallback(async (
    todoChangeTitle: Todo,
    newTitle: string,
  ) => {
    const todoIdChangeTitle = todoChangeTitle.id;

    setTodosWithLoader(currentTodos => [...currentTodos, todoChangeTitle]);

    try {
      await updateTitleTodo(todoIdChangeTitle, newTitle);
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to update a todo');
    } finally {
      clearMessage();
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(t => t.id !== todoChangeTitle.id)
      ));
    }
  }, []);

  const toggleStatusForAllTodos = useCallback(async () => {
    const statusForUpdate = todos.length !== completedTodos.length;

    const arrayForUpdate = todos.filter(todo => (
      todo.completed !== statusForUpdate
    ));

    try {
      await Promise.all(
        arrayForUpdate
          .map((todo: Todo) => updateStatusTodo(todo.id, statusForUpdate)),
      );
      await getAllTodos();
    } catch {
      addErrorMessage('Unable to update status of all todos');
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {!isLoadingFailed && (
          <>
            <Header
              addNewTodo={addNewTodo}
              addErrorMessage={addErrorMessage}
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              toggleStatusForAllTodos={toggleStatusForAllTodos}
            />

            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              removeTodo={removeTodo}
              changeStatus={changeStatus}
              changeTitle={changeTitle}
              todosWithLoader={todosWithLoader}
            />
          </>
        )}

        <Footer
          setFilterBy={setFilterBy}
          filterBy={filterBy}
          removeAllCompletedTodos={removeAllCompletedTodos}
          numberOfNotCompletedTodos={numberOfNotCompletedTodos}
          isClearAllButtonVisible={isClearAllButtonVisible}
        />
      </div>

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          setMessage={clearMessage}
        />
      )}
    </div>
  );
};

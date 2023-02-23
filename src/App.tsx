import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

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
import { ErrorMessages } from './types/ErrorMessages';

const USER_ID = 6354;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosWithLoader, setTodosWithLoader] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState(ErrorMessages.NONE);

  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.ALL);

  const visibleTodos = useMemo(() => (
    getFilteredTodos(todos, filterBy)
  ), [todos, filterBy]);

  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed === true)
  ), [todos]);

  const numberOfNotCompletedTodos = todos.length - completedTodos.length;

  const isClearAllButtonVisible = Boolean(!completedTodos.length);
  const isToogleButtonVisible = Boolean(!numberOfNotCompletedTodos);
  const isSubmitButtonDisabled = Boolean(tempTodo?.title.length);

  const addErrorMessage = useCallback((newMessage: ErrorMessages) => {
    setErrorMessage(newMessage);
  }, []);

  const getAllTodos = useCallback(async () => {
    try {
      const allTodos = await getTodos(USER_ID);

      setTodos(allTodos);
    } catch {
      addErrorMessage(ErrorMessages.LOAD);
    }
  }, []);

  useEffect(() => {
    getAllTodos();
  }, []);

  const clearMessage = useCallback(() => {
    setErrorMessage(ErrorMessages.NONE);
  }, [errorMessage]);

  const addNewTodo = useCallback(async (title: string) => {
    clearMessage();

    if (!title) {
      addErrorMessage(ErrorMessages.TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    const todoForLoader = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(todoForLoader);

    try {
      await addTodo(USER_ID, newTodo);
      await getAllTodos();
    } catch {
      addErrorMessage(ErrorMessages.ADD);
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
      addErrorMessage(ErrorMessages.DELETE);
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
      addErrorMessage(ErrorMessages.DELETE_COMPLETED);
    } finally {
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(todo => todo.completed !== true)
      ));
    }
  }, [completedTodos]);

  const changeStatus = useCallback(async (todoChangeStatus: Todo) => {
    clearMessage();

    const newTodoStatus = !todoChangeStatus.completed;
    const todoIdChangeStatus = todoChangeStatus.id;

    setTodosWithLoader(currentTodos => [...currentTodos, todoChangeStatus]);

    try {
      await updateStatusTodo(todoIdChangeStatus, newTodoStatus);
      await getAllTodos();
    } catch {
      addErrorMessage(ErrorMessages.UPDATE);
    } finally {
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(t => t.id !== todoChangeStatus.id)
      ));
    }
  }, [todos]);

  const changeTitle = useCallback(async (
    todoChangeTitle: Todo,
    newTitle: string,
  ) => {
    clearMessage();
    const todoIdChangeTitle = todoChangeTitle.id;

    setTodosWithLoader(currentTodos => [...currentTodos, todoChangeTitle]);

    try {
      await updateTitleTodo(todoIdChangeTitle, newTitle);
      await getAllTodos();
    } catch {
      addErrorMessage(ErrorMessages.UPDATE);
    } finally {
      setTodosWithLoader(currentTodos => (
        currentTodos.filter(t => t.id !== todoChangeTitle.id)
      ));
    }
  }, [todos]);

  const toggleStatusForAllTodos = useCallback(async () => {
    clearMessage();

    const statusForUpdate = todos.length !== completedTodos.length;

    const arrayForUpdate = todos.filter(todo => (
      todo.completed !== statusForUpdate
    ));

    setTodosWithLoader(currentTodos => [...currentTodos, ...arrayForUpdate]);

    try {
      await Promise.all(
        arrayForUpdate
          .map((todo: Todo) => updateStatusTodo(todo.id, statusForUpdate)),
      );
      await getAllTodos();
    } catch {
      addErrorMessage(ErrorMessages.UPDATE_ALL);
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {todos.length && (
          <>
            <Header
              addNewTodo={addNewTodo}
              addErrorMessage={addErrorMessage}
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              toggleStatusForAllTodos={toggleStatusForAllTodos}
              isToogleButtonVisible={isToogleButtonVisible}
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

      {errorMessage !== ErrorMessages.NONE && (
        <ErrorMessage
          typeOfError={errorMessage}
          setMessage={clearMessage}
        />
      )}
    </div>
  );
};

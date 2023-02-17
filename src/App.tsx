/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { UserWarning } from './components/UserWarning/UserWarning';
import { ErrorMessages } from './types/ErrorMessages';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { closeNotification } from './utils/closeNotification';
import { prepareTodo } from './utils/prepareTodo';

const USER_ID = 6337;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [title, setTitle] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setTempTodo] = useState<Todo | null>(null);
  const [isError, setIsError] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<ErrorMessages>(ErrorMessages.NONE);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState(0);

  const activeTodos = todos
    .filter(todo => !todo.completed);
  const hasActiveTodos = activeTodos.length > 0;
  const howManyActiveTodosLeft = activeTodos.length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(USER_ID);

      setTodos(loadedTodos);
    } catch (error) {
      setIsError(true);
      closeNotification(setIsError, false, 3000);
      throw new Error(`There is an error: ${error}`);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const preparedTodos = useMemo(() => {
    return prepareTodo(todos, filterBy);
  }, [todos, filterBy]);

  const handleAddTodo = async (todoTitle: string) => {
    if (todoTitle.length === 0) {
      setIsError(true);
      setErrorMessage(ErrorMessages.TITLE);
      closeNotification(setIsError, false, 3000);

      return;
    }

    const todoToAdd = {
      id: 0,
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    try {
      setIsInputDisabled(true);
      setTitle('');

      const newTodo = await addTodo(USER_ID, todoToAdd);

      setTempTodo(newTodo);

      setTodos(currentTodos => ([
        ...currentTodos, newTodo,
      ]));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessages.ADD);
      closeNotification(setIsError, false, 3000);
    } finally {
      setTempTodo(null);
      setIsInputDisabled(false);
    }
  };

  const handleDeleteTodo = async (todoToDelete: Todo) => {
    try {
      await deleteTodo(USER_ID, todoToDelete.id);

      setTodos(currentTodos => (
        currentTodos.filter(todo => todo.id !== todoToDelete.id)
      ));
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessages.DELETE);
      closeNotification(setIsError, false, 3000);
    }
  };

  const handleDeleteCompletedTodos = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo);
      }
    });
  };

  const handleUpdateTodoStatus = async (todoToUpdate: Todo) => {
    const newStatus = !todoToUpdate.completed;

    try {
      setIsUpdatingTodoId(todoToUpdate.id);

      const updatedTodo: Todo = await updateTodoStatus(
        USER_ID,
        todoToUpdate.id,
        newStatus,
      );

      setTodos(currentTodos => {
        return currentTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ));
      });
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessages.UPDATE);
      closeNotification(setIsError, false, 3000);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  const handleUpdateAllTodosStatus = async () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    const todosToUdape = todos
      .filter(todo => todo.completed !== !isAllCompleted);

    todosToUdape.forEach(todo => {
      handleUpdateTodoStatus(todo);
    });
  };

  const handleUpdateTodoTitle = async (
    todoToUpdate: Todo,
    newTitle: string,
  ) => {
    try {
      setIsUpdatingTodoId(todoToUpdate.id);

      const updatedTodo: Todo = await updateTodoTitle(
        USER_ID,
        todoToUpdate.id,
        newTitle,
      );

      setTodos(currentTodos => {
        return currentTodos.map(todo => (
          todo.id === todoToUpdate.id
            ? updatedTodo
            : todo
        ));
      });
    } catch {
      setIsError(true);
      setErrorMessage(ErrorMessages.UPDATE);
      closeNotification(setIsError, false, 3000);
    } finally {
      setIsUpdatingTodoId(0);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasActiveTodos={hasActiveTodos}
          isInputDisabled={isInputDisabled}
          title={title}
          onTitleChange={setTitle}
          onAddTodo={handleAddTodo}
          handleUpdateAllTodosStatus={handleUpdateAllTodosStatus}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={preparedTodos}
              onDeleteTodo={handleDeleteTodo}
              handleUpdateTodoStatus={handleUpdateTodoStatus}
              isUpdatingTodoId={isUpdatingTodoId}
              handleUpdateTodoTitle={handleUpdateTodoTitle}
              setIsError={setIsError}
              setErrorMessage={setErrorMessage}
            />
            <Footer
              howManyActiveTodosLeft={howManyActiveTodosLeft}
              hasCompletedTodos={hasCompletedTodos}
              filterBy={filterBy}
              onFilterBy={setFilterBy}
              onDeleteCopletedTodos={handleDeleteCompletedTodos}
            />
          </>
        )}
      </div>

      <Notification
        isError={isError}
        errorMessage={errorMessage}
        onIsError={setIsError}
      />
    </div>
  );
};

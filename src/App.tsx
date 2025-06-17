/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { StatusTodos } from './types/StatusTodos';
import { ErrorNotificationMessage } from './types/ErrorNotificationMessage';

const prepereTodos = (todos: Todo[], statusTodos: StatusTodos) => {
  switch (statusTodos) {
    case StatusTodos.Completed:
      return todos.filter(todo => todo.completed);
    case StatusTodos.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);
  const [isUpdatingTodo, setIsUpdatingTodo] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletedTodoId, setDeletedTodoId] = useState<Todo['id']>(0);
  const [toggledTodoId, setToggledTodoId] = useState<Todo['id']>(0);

  const [errorMessage, setErrorMessage] = useState(
    ErrorNotificationMessage.Cleared,
  );

  const [newTitle, setNewTitle] = useState('');
  const [updateTitle, setUpdateTitle] = useState('');

  const [selectStatusTodos, setSelectStatusTodos] = useState(StatusTodos.All);

  const visibleTodos = prepereTodos(todos, selectStatusTodos);

  const isActive = todos.every(todo => todo.completed);

  useEffect(() => {
    setIsLoadingTodos(true);
    setErrorMessage(ErrorNotificationMessage.Cleared);

    getTodos()
      .then(setTodos)
      .catch(error => {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToLoadTodos);
          throw new Error(error.message);
        }
      })
      .finally(() => setIsLoadingTodos(false));
  }, []);

  const handleAddTodo = useCallback(
    async ({ title, completed, userId }: Omit<Todo, 'id'>) => {
      const temp = { id: 0, title, completed, userId };

      setTempTodo(temp);

      try {
        const newTodo = await postTodo({ title, completed, userId });

        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToAddTodos);
          throw new Error(error.message);
        }
      } finally {
        setTempTodo(null);
      }
    },
    [],
  );

  const handleChangeTodo = useCallback(
    async ({ id, title, completed }: Omit<Todo, 'userId'>) => {
      try {
        await updateTodo({ id, title, completed });

        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === id ? { ...todo, title, completed } : todo,
          ),
        );
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(ErrorNotificationMessage.UnableToUpdateTodos);
          throw new Error(error.message);
        }
      } finally {
        setToggledTodoId(0);
      }
    },
    [],
  );

  const handleChangeAllTodos = useCallback(async () => {
    const shouldBeCompleted = !isActive;

    setIsUpdatingTodo(true);

    try {
      const updatePromises = todos
        .filter(todo => todo.completed !== shouldBeCompleted)
        .map(todo =>
          updateTodo({
            id: todo.id,
            title: todo.title,
            completed: shouldBeCompleted,
          }),
        );

      await Promise.all(updatePromises);

      setTodos(currentTodos =>
        currentTodos.map(todo => ({
          ...todo,
          completed: shouldBeCompleted,
        })),
      );
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(ErrorNotificationMessage.UnableToUpdateTodos);
      }
    } finally {
      setIsUpdatingTodo(false);
    }
  }, [isActive, todos]);

  const handleDeleteTodo = useCallback(async (todoId: Todo['id']) => {
    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
        throw new Error(error.message);
      }
    } finally {
      setTempTodo(null);
      setDeletedTodoId(0);
    }
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currTodo => currTodo.id !== todo.id),
          );
        })
        .catch(error => {
          if (error instanceof Error) {
            setErrorMessage(ErrorNotificationMessage.UnableToDeleteTodos);
            throw new Error(error.message);
          }
        }),
    );
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isLoadingTodos={isLoadingTodos}
          isActive={isActive}
          newTitle={newTitle}
          todosLength={todos.length}
          onChangeNewTitle={setNewTitle}
          addTodo={handleAddTodo}
          onErrorMessage={setErrorMessage}
          onChangeAllTodos={handleChangeAllTodos}
        />

        {isLoadingTodos ? (
          'Loading....'
        ) : (
          <TodoList
            isUpdatingTodo={isUpdatingTodo}
            visibleTodos={visibleTodos}
            deletedTodoId={deletedTodoId}
            toggledTodoId={toggledTodoId}
            updateTitle={updateTitle}
            tempTodo={tempTodo}
            onChangeDeletedTodoId={setDeletedTodoId}
            onDeleteTodo={handleDeleteTodo}
            onChangeTodo={handleChangeTodo}
            onToggledTodoId={setToggledTodoId}
            onUpdateTitle={setUpdateTitle}
          />
        )}

        {todos.length > 0 && !isLoadingTodos && (
          <Footer
            todos={todos}
            selectStatusTodos={selectStatusTodos}
            onChangeStatusTodos={setSelectStatusTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onErrorMessage={setErrorMessage}
      />
    </div>
  );
};

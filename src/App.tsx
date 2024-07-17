/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, updateTodoCheck, USER_ID } from './api/todos';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { useDispatch } from './GlobalStateProvider';
import { Type } from './types/Action';
import { ErrorNotifications } from './components/ErrorNotifications';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Errors';

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const handleError = (message: string) => {
    dispatch({
      type: Type.setErrorMessage,
      payload: message,
    });
    setTimeout(
      () => dispatch({ type: Type.setErrorMessage, payload: '' }),
      3000,
    );
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const getTodosFromServer = async () => {
      try {
        dispatch({ type: Type.setLoading, payload: true });

        const response = await getTodos();

        dispatch({ type: Type.setTodos, payload: response });
      } catch {
        handleError(ErrorType.LOAD_TODOS);
      } finally {
        dispatch({ type: Type.setLoading, payload: false });
      }
    };

    getTodosFromServer();
  }, []);

  const deleteTodosFromServer = async (item: Todo) => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
    dispatch({ type: Type.setIsSubmitting, payload: true });

    try {
      await deleteTodos(item.id);
      dispatch({ type: Type.DeleteTodo, payload: item });
    } catch {
      handleError(ErrorType.DELETE_TODO);
    } finally {
      {
        dispatch({ type: Type.resetLoadingTodos, payload: item.id });
        dispatch({ type: Type.setIsSubmitting, payload: false });
      }
    }
  };

  const updateTodoCheckOnServer = async (updatedTodo: Todo) => {
    dispatch({ type: Type.setErrorMessage, payload: '' });
    dispatch({ type: Type.setLoadingTodos, payload: updatedTodo.id });

    try {
      const item = await updateTodoCheck(updatedTodo);

      dispatch({ type: Type.UpdateTodoCheckStatus, payload: item });
    } catch {
      handleError(ErrorType.UPDATE_TODO);
    } finally {
      dispatch({ type: Type.resetLoadingTodos, payload: updatedTodo.id });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleError={handleError}
          updateTodoCheckOnServer={updateTodoCheckOnServer}
        />
        <TodoList
          deleteTodosFromServer={deleteTodosFromServer}
          handleError={handleError}
          updateTodoCheckOnServer={updateTodoCheckOnServer}
        />
        <Footer deleteTodosFromServer={deleteTodosFromServer} />
      </div>
      <ErrorNotifications />
    </div>
  );
};

/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Header } from './componens/Header/Header';
import { TodoList } from './componens/Todos/TodoList';
import { Footer } from './componens/Footer/Footer';
import { useAppDispatch, useAppSelector } from './app/hook';
import * as todosAction from './features/todos';
import * as statusAction from './features/status';

const USER_ID = 11582;

export const App: React.FC = () => {
  const todos = useAppSelector(state => state.todos.todos);

  const errorMessage = useAppSelector(state => state.todos.errorMessage);

  const dispatch = useAppDispatch();

  const completedTodos = todos.filter(item => item.completed);

  const statusAllCompleted = useAppSelector(
    state => state.status.statusAllCompleted,
  );

  useEffect(() => {
    if (completedTodos.length === todos.length) {
      dispatch(statusAction.setStatusAllCompleted(true));
    } else {
      dispatch(statusAction.setStatusAllCompleted(false));
    }
  }, [completedTodos.length]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        dispatch(todosAction.clearErrorMessage());
      }, 3000);
    }
  }, [errorMessage]);

  useEffect(() => {
    dispatch(todosAction.init(USER_ID));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteTodo = (id: number) => {
    dispatch(statusAction.setStatusResponse(id));
    todoService.deleteTodos(id)
      .then(() => {
        dispatch(statusAction.setStatusResponse(null));
        dispatch(statusAction.setAllDeleteCompleted(false));

        dispatch(todosAction.take(id));
      })
      .catch((error) => {
        dispatch(todosAction.setErrorMessage('Unable to delete a todo'));
        dispatch(statusAction.setStatusResponse(null));

        throw error;
      });
  };

  const clearCompleted = () => {
    dispatch(statusAction.setAllDeleteCompleted(true));

    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const updateTodo = (id: number, completed: boolean, title: string) => {
    dispatch(statusAction.setStatusResponse(id));
    todoService.updateTodos(id, completed, title)
      .then(() => {
        dispatch(todosAction.update({ id, completed, title }));
        dispatch(statusAction.setStatusAllChange(false));
        dispatch(statusAction.setStatusResponse(null));
      })
      .catch((error) => {
        dispatch(todosAction.setErrorMessage('Unable to update a todo'));
        dispatch(statusAction.setStatusResponse(null));
        dispatch(statusAction.setStatusAllChange(false));

        throw error;
      });
  };

  const toggleAllChange = () => {
    dispatch(statusAction.setStatusAllChange(true));

    todos.forEach((todo) => {
      updateTodo(todo.id, !statusAllCompleted, todo.title);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header toggleAllChange={toggleAllChange} />

        <TodoList
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />

        {todos.length > 0 && (
          <Footer
            clearCompleted={clearCompleted}
          />
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={
          classNames(
            'notification is-danger is-light has-text-weight-normal',
            { hidden: !errorMessage },
          )
        }

      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            dispatch(todosAction.clearErrorMessage());
          }}
        />
        {errorMessage}

      </div>
    </div>
  );
};

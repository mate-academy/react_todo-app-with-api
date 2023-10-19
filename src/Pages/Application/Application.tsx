import React, { useEffect } from 'react';

import { useTodosContext, useApiErrorContext }
  from '../../hooks/getContextHooks';

import { Header } from '../../Components/Header';
import { TodosList } from '../../Components/TodosList';
import { Footer } from '../../Components/Footer';
import { ApiError } from '../../Components/UI/ApiError';
import { getTodos } from '../../api/todos';
import USER_ID from '../../helpers/USER_ID';
import { loadTodosAction } from '../../Context/actions/actionCreators';

export const Application: React.FC = () => {
  const { todos, tempTodo, dispatch } = useTodosContext();
  const { setApiError } = useApiErrorContext();
  const isContentVisible = Boolean(todos.length) || Boolean(tempTodo);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        const action = loadTodosAction(data);

        dispatch(action);
      })
      .catch(e => setApiError(e));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Header />

      {isContentVisible && (
        <div className="todoapp__content">
          <TodosList />

          <Footer />
        </div>
      )}

      <ApiError />
    </div>
  );
};

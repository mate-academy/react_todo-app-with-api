import React, { useContext, useEffect, useState } from 'react';

import { getTodos } from './api/todos';
import { Content } from './components/Content';
import { Errors } from './components/Errors';

import { Error } from './types/Error';
import { Todo } from './types/Todo';

import { UserContext } from './UserContext';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Error>(Error.success);
  const [hidden, setHidden] = useState(true);

  const userId = useContext(UserContext);

  useEffect(() => {
    getTodos(userId).then(setAllTodos);
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <Content
        todos={allTodos}
        changeTodos={setAllTodos}
        userId={userId}
        onError={setError}
        onHidden={setHidden}
      />

      <Errors
        errorMessage={error}
        errorVisibility={hidden}
        onHidden={setHidden}
      />
    </div>
  );
};

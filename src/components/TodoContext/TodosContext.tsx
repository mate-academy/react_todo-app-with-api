import React, {
  useEffect, useState, useContext, useCallback,
} from 'react';
import {
  deleteTodo, getTodos, patchTodo, sendTodo,
} from '../../api/todos';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { AuthContext } from '../Auth/AuthContext';

// #region types

type Props = {
  children: React.ReactNode;
};

type Context = {
  todos: Todo[],
  user: User | null,
  error: string,
  modifiedTodosId: number[],
  hidden: boolean,
};

type UpdateContext = {
  closeErrorMessage: () => void,
  showError: (errorText: string) => void,
  setActiveIds: (ids: number[]) => void,
  sendNewTodo: (data: Todo) => void,
  modifyTodos: (data: Todo[]) => void,
  deleteTodos: (id: number[]) => void,
};

// #endregion

export const TodoContext = React.createContext<Context>({
  todos: [],
  user: null,
  error: '',
  modifiedTodosId: [0],
  hidden: true,
});

export const TodoUpdateContext = React.createContext<UpdateContext>({
  closeErrorMessage: () => {},
  showError: () => {},
  setActiveIds: () => {},
  sendNewTodo: () => {},
  modifyTodos: () => {},
  deleteTodos: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]); // array of Todos
  const [modifiedTodosId, setModifiedTodosId] = useState<number[]>([0]); // todo currently operated
  const [hidden, setHidden] = useState(true); // show or not error box
  const [error, setError] = useState(''); // error text

  // #region ---- Error ----

  // close error
  const closeErrorMessage = useCallback(() => {
    setError('');
    setHidden(true);
  }, []);

  // set and show error
  const showError = useCallback((errorText: string) => {
    setError(errorText);
    setHidden(false);
  }, []);

  // #endregion

  // handle state with adds which data is currently sending on server
  const setActiveIds = useCallback((ids: number[]) => (
    setModifiedTodosId(ids)
  ), []);

  // #region ---- DATA API ----
  // download todos from server
  const loadTodos = useCallback(async () => {
    if (user) {
      try {
        const todosFromApi = await getTodos(user.id);

        setTodos(todosFromApi);
      } catch {
        showError('Unable to download todos');
        throw new Error('Unable to download todos');
      }
    }
  }, [user]);

  // adding todo when getting title from user
  const sendNewTodo = useCallback(async (newTodo: Todo) => {
    setTodos(current => (
      [...current, { ...newTodo }]
    ));

    if (user) {
      try {
        await sendTodo(user.id, newTodo);

        loadTodos();
      } catch {
        showError('Unable to add a todo');
        setTodos(current => current.slice(0, current.length - 1));
        throw new Error('Unable to add a todo');
      }
    }
  }, []);

  // delete todos or todo
  const deleteTodos = useCallback(async (todosId: number[]) => {
    if (user) {
      try {
        await Promise.all(todosId.map(todoId => deleteTodo(todoId)));

        loadTodos();
        setModifiedTodosId([0]);
      } catch {
        setModifiedTodosId([0]);
        showError('Unable to delete a todo');
        throw new Error('Unable to delete a todo');
      }
    }
  }, [user]);

  // modify todos through modifying complete status or title
  const modifyTodos = useCallback(async (changedTodos: Todo[]) => {
    if (user) {
      try {
        await Promise.all(changedTodos.map(todo => patchTodo(todo)));

        loadTodos();
        setModifiedTodosId([0]);
      } catch {
        setModifiedTodosId([0]);
        showError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      }
    }
  }, [user]);

  // #endregion

  // load data
  useEffect(() => {
    loadTodos();
  }, []);

  const contextValue = {
    todos,
    user,
    error,
    modifiedTodosId,
    hidden,
  };

  const updateContextValue = {
    closeErrorMessage,
    setActiveIds,
    sendNewTodo,
    modifyTodos,
    deleteTodos,
    showError,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      <TodoUpdateContext.Provider value={updateContextValue}>
        {children}
      </TodoUpdateContext.Provider>
    </TodoContext.Provider>
  );
};

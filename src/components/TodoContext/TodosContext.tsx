import React, {
  useEffect, useState, useContext,
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
  const closeErrorMessage = () => {
    setError('');
    setHidden(true);
  };

  // set and show error
  function showError(errorText: string) {
    setError(errorText);
    setHidden(false);
  }

  // #endregion

  // handle state with adds which data is currently sending on server
  function setActiveIds(ids: number[]) {
    setModifiedTodosId(ids);
  }

  // #region ---- DATA API ----
  // download todos from server
  async function loadTodos() {
    if (user) {
      try {
        const todosFromApi = await getTodos(user.id);

        setTodos(todosFromApi);
      } catch {
        showError('Unable to download todos');
        throw new Error('Unable to download todos');
      }
    }
  }

  // adding todo when getting title from user
  async function sendNewTodo(newTodo: Todo) {
    setTodos(current => (
      [...current, { ...newTodo }]
    ));

    if (user) {
      try {
        const todoFromServer = await sendTodo(user.id, newTodo);

        setTodos(current => current.map(todo => {
          if (todo.id === 0) {
            return { ...todo, id: todoFromServer.id };
          }

          return todo;
        }));
      } catch {
        showError('Unable to add a todo');
        setTodos(current => current.slice(0, current.length - 1));
        throw new Error('Unable to add a todo');
      }
    }
  }

  // delete todos or todo
  async function deleteTodos(todosId: number[]) {
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
  }

  // modify todos through modifying complete status or title
  async function modifyTodos(changedTodos: Todo[]) {
    if (user) {
      try {
        const todosFromServer = await Promise
          .all(changedTodos.map(todo => patchTodo(todo)));

        setTodos(currentTodos => currentTodos.map(todo => {
          const modifiedTodo: Todo | null = todosFromServer
            .find(todoFromServer => todoFromServer.id === todo.id) || null;

          if (modifiedTodo) {
            return {
              ...todo,
              title: modifiedTodo.title || '',
              completed: modifiedTodo.completed || false,
            };
          }

          return todo;
        }));
        setModifiedTodosId([0]);
      } catch {
        setModifiedTodosId([0]);
        showError('Unable to update a todo');
        throw new Error('Unable to update a todo');
      }
    }
  }

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

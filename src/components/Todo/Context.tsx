import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Todo } from '../../types/Todo';
import {
  USER_ID,
  deleteTodo,
  getTodos,
  patchTodoCompleted,
  patchTodoTitle,
  postTodo,
} from '../../api/todos';
import { TodoRequestBody } from '../../types/requestBodies';
import { TempTodo } from '../../types/types';
import { ApiContextValue, TodosContextValue } from '../../types/contextValues';

const updateTodoInTodos = (todos: Todo[], modifiedTodo: Todo): Todo[] =>
  todos.map(todo => (todo.id === modifiedTodo.id ? modifiedTodo : todo));

const addIdOfProcessedTodo = (
  idsOfProcessedTodos: number[],
  id: number,
): number[] => [...idsOfProcessedTodos, id];

const removeIdOfProcessedTodo = (
  idsOfProcessedTodos: number[],
  id: number,
): number[] =>
  idsOfProcessedTodos.filter(idOfProcessedTodo => idOfProcessedTodo !== id);

const TodosContext = React.createContext<TodosContextValue | null>(null);
const ProcessContext = React.createContext<number[] | null>(null);
const ErrorContext = React.createContext<string | null>(null);
const ApiContext = React.createContext<ApiContextValue | null>(null);

type Props = React.PropsWithChildren;

export const TodoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo>(null);
  const [idsOfProcessedTodos, setIdsOfProcessedTodos] = useState<number[]>([]);
  const [sentErrorMessage, setSentErrorMessage] = useState('');

  const handleErrorMessageReceived = () => setSentErrorMessage('');

  const handleCompletedChange = (id: number, completed: boolean) => {
    setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
      addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
    );

    patchTodoCompleted(id, completed)
      .then(todo => {
        setTodos(prevTodos => updateTodoInTodos(prevTodos, todo));
      })
      .catch(() => {
        setSentErrorMessage('Unable to update a todo');
      })
      .finally(() =>
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        ),
      );
  };

  const handleTitleChange = (id: number, title: string): Promise<boolean> => {
    setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
      addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
    );

    return patchTodoTitle(id, title)
      .then(todo => {
        setTodos(prevTodos => updateTodoInTodos(prevTodos, todo));

        return true;
      })
      .catch(() => {
        setSentErrorMessage('Unable to update a todo');

        return false;
      })
      .finally(() =>
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        ),
      );
  };

  const handleTodoAdd = (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length) {
      const todoRequestBody: TodoRequestBody = {
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setTempTodo({
        ...todoRequestBody,
        id: 0,
      });

      return postTodo({ ...todoRequestBody })
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);

          return true;
        })
        .catch(() => {
          setSentErrorMessage('Unable to add a todo');

          return false;
        })
        .finally(() => setTempTodo(null));
    }

    setSentErrorMessage('Title should not be empty');

    return Promise.resolve(false);
  };

  const handleTodoRemove = (id: number): Promise<boolean> => {
    setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
      addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
    );

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

        return true;
      })
      .catch(() => {
        setSentErrorMessage('Unable to delete a todo');

        return false;
      })
      .finally(() =>
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        ),
      );
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setSentErrorMessage('Unable to load todos');
      });
  }, []);

  const todosValue = useMemo(
    () => ({
      todos,
      tempTodo,
    }),
    [todos, tempTodo],
  );

  const apiValue = useMemo(
    () => ({
      handleErrorMessageReceived,
      handleCompletedChange,
      handleTitleChange,
      handleTodoAdd,
      handleTodoRemove,
    }),
    [],
  );

  return (
    <ApiContext.Provider value={apiValue}>
      <ErrorContext.Provider value={sentErrorMessage}>
        <ProcessContext.Provider value={idsOfProcessedTodos}>
          <TodosContext.Provider value={todosValue}>
            {children}
          </TodosContext.Provider>
        </ProcessContext.Provider>
      </ErrorContext.Provider>
    </ApiContext.Provider>
  );
};

export const useTodoTodos = () => {
  const value = useContext(TodosContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoProcess = () => {
  const value = useContext(ProcessContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoError = () => {
  const value = useContext(ErrorContext);

  if (!value && value !== '') {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

export const useTodoApi = () => {
  const value = useContext(ApiContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

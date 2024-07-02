import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import {
  TodoApiContextValue,
  TodosContextValue,
} from '../../types/contextValues';
import { useErrorNotificationApi } from '../ErrorNotification/Context';

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
const TodoApiContext = React.createContext<TodoApiContextValue | null>(null);

type Props = React.PropsWithChildren;

export const TodoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<TempTodo>(null);
  const [idsOfProcessedTodos, setIdsOfProcessedTodos] = useState<number[]>([]);
  const { handleErrorMessageSend } = useErrorNotificationApi();

  const handleCompletedChange = useCallback(
    async (id: number, completed: boolean) => {
      setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
        addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
      );

      try {
        const modifiedTodo = await patchTodoCompleted(id, completed);

        setTodos(prevTodos => updateTodoInTodos(prevTodos, modifiedTodo));
      } catch {
        handleErrorMessageSend('Unable to update a todo');
      } finally {
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        );
      }
    },
    [handleErrorMessageSend],
  );

  const handleTitleChange = useCallback(
    async (id: number, title: string): Promise<boolean> => {
      setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
        addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
      );

      try {
        const modifiedTodo = await patchTodoTitle(id, title);

        setTodos(prevTodos => updateTodoInTodos(prevTodos, modifiedTodo));

        return true;
      } catch {
        handleErrorMessageSend('Unable to update a todo');

        return false;
      } finally {
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        );
      }
    },
    [handleErrorMessageSend],
  );

  const handleTodoAdd = useCallback(
    async (title: string): Promise<boolean> => {
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

        try {
          const newTodo = await postTodo({ ...todoRequestBody });

          setTodos(prevTodos => [...prevTodos, newTodo]);

          return true;
        } catch {
          handleErrorMessageSend('Unable to add a todo');

          return false;
        } finally {
          setTempTodo(null);
        }
      }

      handleErrorMessageSend('Title should not be empty');

      return false;
    },
    [handleErrorMessageSend],
  );

  const handleTodoRemove = useCallback(
    async (id: number): Promise<boolean> => {
      setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
        addIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
      );

      try {
        await deleteTodo(id);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

        return true;
      } catch {
        handleErrorMessageSend('Unable to delete a todo');

        return false;
      } finally {
        setIdsOfProcessedTodos(prevIdsOfProcessedTodos =>
          removeIdOfProcessedTodo(prevIdsOfProcessedTodos, id),
        );
      }
    },
    [handleErrorMessageSend],
  );

  const loadTodos = useCallback(async () => {
    try {
      const loadedTodos = await getTodos();

      setTodos(loadedTodos);
    } catch {
      handleErrorMessageSend('Unable to load todos');
    }
  }, [handleErrorMessageSend]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const todosValue = useMemo(
    () => ({
      todos,
      tempTodo,
    }),
    [todos, tempTodo],
  );

  const apiValue = useMemo(
    () => ({
      handleCompletedChange,
      handleTitleChange,
      handleTodoAdd,
      handleTodoRemove,
    }),
    [handleCompletedChange, handleTitleChange, handleTodoAdd, handleTodoRemove],
  );

  return (
    <TodoApiContext.Provider value={apiValue}>
      <ProcessContext.Provider value={idsOfProcessedTodos}>
        <TodosContext.Provider value={todosValue}>
          {children}
        </TodosContext.Provider>
      </ProcessContext.Provider>
    </TodoApiContext.Provider>
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

export const useTodoApi = () => {
  const value = useContext(TodoApiContext);

  if (!value) {
    throw new Error('TodoProvider is missing!!!');
  }

  return value;
};

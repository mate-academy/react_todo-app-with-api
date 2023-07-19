import {
  FC,
  ReactNode,
  useState,
  createContext,
} from 'react';
import { getUserId } from '../api/todos';
import { useUserId } from '../hooks/useUserId';

interface Context {
  userId: number | null;
  handleUserId: (email: string) => void;
  todosIdsOnLoad: number[];
  addTodoIdOnLoad: (id: number) => void;
  removeTodoIdAfterLoading: (id: number) => void;
}

const initialContextState: Context = {
  userId: null,
  handleUserId() {},
  todosIdsOnLoad: [],
  addTodoIdOnLoad() {},
  removeTodoIdAfterLoading() {},
};

export const TodoContext = createContext<Context>(initialContextState);

type Props = {
  children: ReactNode,
};

export const TodoContextProvider: FC<Props> = ({ children }) => {
  const [todosIdsOnLoad, setTodoIdOnLoad] = useState<number[]>([]);
  const [userId, setUserId] = useUserId();

  const addTodoIdOnLoad = (id: number) => {
    setTodoIdOnLoad(prevIds => [
      ...prevIds,
      id,
    ]);
  };

  const removeTodoIdAfterLoading = (id: number) => {
    setTodoIdOnLoad(prevIds => [
      ...prevIds.filter(prevId => prevId !== id),
    ]);
  };

  const handleUserId = async (email: string) => {
    try {
      const [user] = await getUserId(email);

      setUserId(user.id);
    } catch {
      throw Error('Error');
    }
  };

  return (
    <TodoContext.Provider value={{
      userId,
      handleUserId,
      todosIdsOnLoad,
      addTodoIdOnLoad,
      removeTodoIdAfterLoading,
    }}
    >
      {children}
    </TodoContext.Provider>
  );
};

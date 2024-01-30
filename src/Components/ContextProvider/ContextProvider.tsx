import {
  FC,
  ReactNode,
  useState,
  useEffect,
} from 'react';

import {
  getTodos,
} from '../../api/todos';

import { Context } from '../../Context';

import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Filter } from '../../types/Filter';

interface Props {
  children: ReactNode;
}

export const ContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const USER_ID = 12176;

  const contextProps = {
    USER_ID,
    todos,
    errorMessage,
    filter,
    globalLoading,
    tempTodo,
    setFilter,
    setTodos,
    setErrorMessage,
    setGlobalLoading,
    setTempTodo,
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_LOAD));
  }, []);

  return (
    <Context.Provider value={contextProps}>
      {children}
    </Context.Provider>
  );
};

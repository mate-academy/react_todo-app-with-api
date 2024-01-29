import {
  FC,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  getTodos,
  updateTodo,
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
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const USER_ID = 12176;

  const handleErrorChange = (value: string) => {
    setErrorMessage(value);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_LOAD));
  }, [todos]);

  const handleActiveTodos = useMemo(() => {
    return todos.reduce((sum, item) => {
      if (!item.completed) {
        return sum + 1;
      }

      return sum;
    }, 0);
  }, [todos]);

  const completeAll = () => {
    const activeTodo = todos
      .filter(todo => !todo.completed);

    const updatePromises = activeTodo
      .map(prevTodo => updateTodo({ ...prevTodo, completed: true }));

    Promise.all(updatePromises)
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      })
      .catch(() => setErrorMessage(ErrorMessage.UNABLE_TO_UPDATE));
  };

  return (
    <Context.Provider value={{
      USER_ID,
      todos,
      errorMessage,
      handleErrorChange,
      handleActiveTodos,
      completeAll,
      filter,
      setFilter,
      setTodos,
    }}
    >
      {children}
    </Context.Provider>
  );
};

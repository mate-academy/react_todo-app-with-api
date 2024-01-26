import {
  FC,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';

import {
  getTodos,
  deleteTodo,
  addTodo,
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

  const filteredTodos = useMemo(() => {
    if (filter === Filter.ACTIVE) {
      return todos.filter((item) => !item.completed);
    }

    if (filter === Filter.COMPLETED) {
      return todos.filter((item) => item.completed);
    }

    return todos;
  }, [filter, todos]);

  const handleActiveTodos = useMemo(() => {
    return todos.reduce((sum, item) => {
      if (!item.completed) {
        return sum + 1;
      }

      return sum;
    }, 0);
  }, [todos]);

  const clearCompleted = () => {
    const updatedTodos = todos.filter((item) => !item.completed);

    setTodos(updatedTodos);
  };

  const handleRemoveTodo = (todoId: number) => {
    deleteTodo(todoId)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_DELETE));
  };

  const handleAddTodo = (todoTitle: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_ADD));
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodo => {
          const newTodos = [...currentTodo];
          const index = newTodos
            .findIndex(newTodo => newTodo.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_UPDATE));
  };

  return (
    <Context.Provider value={{
      USER_ID,
      todos,
      filteredTodos,
      errorMessage,
      handleErrorChange,
      handleActiveTodos,
      clearCompleted,
      handleAddTodo,
      handleRemoveTodo,
      handleUpdateTodo,
      filter,
      setFilter,
    }}
    >
      {children}
    </Context.Provider>
  );
};

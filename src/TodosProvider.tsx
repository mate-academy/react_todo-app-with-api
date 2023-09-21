import { useMemo, useState } from 'react';
import { TodosContext } from './TodosContext';
import { Error } from './types/Error';
import { Todo } from './types/Todo';
import { apiActions } from './api/apiActions';

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(Error.None);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [updatingTodosId, setUpdatingTodosId] = useState<number[]>([]);

  function deleteTodo(id: number) {
    return apiActions.delete(id)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(item => item.id !== id));
      })
      .catch(() => {
        setTodos(todos);
        setError(Error.Delete);
      });
  }

  function addTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
    return apiActions.add({ title, completed, userId })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((e) => {
        setError(Error.Add);
        throw e;
      });
  }

  function updateTodo(id: number, data: Partial<Todo>) {
    return apiActions.update(id, data)
      .catch((e) => {
        setError(Error.Update);
        throw e;
      });
  }

  const state = useMemo(() => ({
    todos,
    tempTodo,
    setTodos,
    error,
    updatingTodosId,
    setError,
    setTempTodo,
    deleteTodo,
    addTodo,
    updateTodo,
    setUpdatingTodosId,
  }), [todos, error, tempTodo, updatingTodosId]);

  return (
    <TodosContext.Provider value={state}>
      {children}
    </TodosContext.Provider>
  );
};

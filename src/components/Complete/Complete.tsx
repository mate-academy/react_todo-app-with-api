/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { updateTodos } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>;
  setLoader: React.Dispatch<React.SetStateAction<number | null>>;
};

export const Complete: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMesage,
  setLoader,
}) => {
  const completed = todo.completed;

  const handleComplete = async (item: Todo) => {
    const updatedTodo = { ...item, completed: !todo.completed };
    const id = todo.id ?? -1;

    setLoader(id);

    try {
      const updatedResponse: Todo = await updateTodos(id, updatedTodo);

      setTodos(prev =>
        prev.map(el => (el.id === updatedResponse.id ? updatedResponse : el)),
      );
    } catch {
      setErrorMesage('Unable to update a todo');
    } finally {
      setLoader(null);
    }
  };

  return (
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        onChange={() => handleComplete(todo)}
        checked={completed}
      />
    </label>
  );
};

import { useContext, useState } from 'react';

import { TodosContext } from '../context/TodoContext';

export const useDeleteTodo = () => {
  const [isDeleting, setDeleting] = useState(false);
  const { deleteCompletedTodos, onFocus, deleteTodo } =
    useContext(TodosContext);

  const handleDeleteTodo = async (id: number) => {
    setDeleting(true);

    await deleteTodo(id);

    setDeleting(false);
    onFocus();
  };

  const handleDeleteCompletedTodos = async () => {
    await deleteCompletedTodos();

    onFocus();
  };

  return { handleDeleteTodo, isDeleting, handleDeleteCompletedTodos };
};

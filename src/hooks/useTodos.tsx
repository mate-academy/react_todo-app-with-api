import { useEffect, useState } from 'react';
import * as todoFromService from '../api/todos';

import { Todo } from '../types/Todo';
import { TypeError } from '../types/TypeError';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TypeError>(
    TypeError.DEFAULT,
  );
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [temptTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const handleAddTodo = (newTodo: Omit<Todo, 'id'>) => {
    todoFromService
      .createTodo(newTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(TypeError.ADDING);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoading(true);
    setLoadingTodoId(currentIds => [...currentIds, todoId]);
    todoFromService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(TypeError.DELETING);
      })
      .finally(() => {
        setLoading(false);
        setLoadingTodoId([]);
      });
  };

  const updateTodo = (updatedTodo: Todo) => {
    setLoadingTodoId(currentIds => [...currentIds, updatedTodo.id]);
    todoFromService
      .updateTodo(updatedTodo)
      .then(newTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (newTodo.id === todo.id ? newTodo : todo)),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(TypeError.UPDATING);
      })
      .finally(() => {
        setLoadingTodoId([]);
      });
  };

  useEffect(() => {
    todoFromService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(TypeError.LOADING));
  }, []);

  return {
    todos,
    errorMessage,
    setErrorMessage,
    handleAddTodo,
    handleDeleteTodo,
    updateTodo,
    loading,
    setLoading,
    newTitle,
    setNewTitle,
    setTempTodo,
    temptTodo,
    loadingTodoId,
    editingTodoId,
    setEditingTodoId,
  };
};

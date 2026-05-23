import { useCallback, useState } from 'react';
import { Todo, UpdateTodoDto } from '../types/Todo';
import { todoApi } from '../api/todos';

export const useTodosState = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const loadTodos = useCallback(async () => {
    const data = await todoApi.load();

    setTodos(data);
  }, []);

  const createTodo = async (newTodoTitle: string) => {
    const newTodo = await todoApi.create(newTodoTitle);

    setTodos(current => [...current, newTodo]);
  };

  const removeTodo = async (id: Todo['id']) => {
    await todoApi.remove(id);

    setTodos(current => current.filter(todo => todo.id !== id));
  };

  const updateTodo = async (id: Todo['id'], data: UpdateTodoDto) => {
    const updatedTodo = await todoApi.update(id, data);

    setTodos(current =>
      current.map(todo => (todo.id === id ? updatedTodo : todo)),
    );
  };

  return {
    todos,
    loadTodos,
    createTodo,
    removeTodo,
    updateTodo,
  };
};

import { useMemo, useState } from 'react';
import { TodoViewModel } from '../types/Todo';

export function useTodosState() {
  const [todos, setTodos] = useState<TodoViewModel[]>([]);
  const [tempTodo, setTempTodo] = useState<TodoViewModel | null>(null);

  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  function updateTodoById(id: number, patch: Partial<TodoViewModel>) {
    setTodos(prev => {
      return prev.map(todo => (todo.id === id ? { ...todo, ...patch } : todo));
    });
  }

  return {
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    completedTodos,
    activeTodos,
    updateTodoById,
  };
}

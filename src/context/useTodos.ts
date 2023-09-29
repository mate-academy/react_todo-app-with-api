import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoService } from '../api/todos';

export const useTodos = (userId: number, onError: () => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (todo: Todo) => {
    setTodos((current) => [...current, todo]);

    return todo;
  };

  const editTodo = (todo: Todo) => {
    setTodos((current) => current.map((v) => (v.id === todo.id ? todo : v)));

    return todo;
  };

  const removeTodo = (toDoId: number) => {
    setTodos((current) => current.filter((v) => v.id !== toDoId));
  };

  useEffect(() => {
    TodoService.getTodos(userId)
      .then(setTodos)
      .catch(onError);
  }, [userId]);

  return {
    todos,
    addTodo,
    editTodo,
    removeTodo,
  };
};

import { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoService } from '../api/todos';
import { Filter } from '../components/ToDoFooter/types';

export const useTodos = (userId: number, onError: () => void) => {
  const [list, setList] = useState<Todo[]>([]);
  const [todoFilter, setTodoFilter] = useState<Filter>(Filter.All);

  const addTodo = (todo: Todo) => {
    setList((current) => [...current, todo]);

    return todo;
  };

  const onEditTodo = (todo: Todo) => {
    setList((current) => current.map((v) => (v.id === todo.id ? todo : v)));

    return todo;
  };

  const removeTodo = (toDoId: number) => {
    setList((current) => current.filter((v) => v.id !== toDoId));
  };

  useEffect(() => {
    TodoService.getTodos(userId)
      .then(setList)
      .catch(onError);
  }, [userId]);

  return {
    filter: todoFilter,
    todos: useMemo(() => ({
      all: list,
      active: list.filter(({ completed }) => !completed),
      completed: list.filter(({ completed }) => completed),
      selected: todoFilter === Filter.All ? list : list
        .filter(todo => (todo.completed && todoFilter === Filter.Completed)
        || (!todo.completed && todoFilter === Filter.Active)),
    }), [list, todoFilter]),
    addTodo,
    onEditTodo,
    removeTodo,
    setTodoFilter: (state:Filter) => setTodoFilter(state),
  };
};

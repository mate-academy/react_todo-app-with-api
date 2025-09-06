import { useState, useMemo } from 'react';
import { Todo } from '../types/todo';
import { TodosStatus } from '../types/enums';

export const useTodoFiltering = (todoList: Todo[], tempTodo: Todo | null) => {
  const [isActive, setIsActive] = useState(TodosStatus.ALL);

  const todosToRender = useMemo(() => {
    return tempTodo ? [...todoList, tempTodo] : todoList;
  }, [todoList, tempTodo]);

  const visibleTodos = useMemo(() => {
    return todosToRender.filter(todo => {
      switch (isActive) {
        case TodosStatus.ACTIVE:
          return !todo.completed;
        case TodosStatus.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todosToRender, isActive]);

  const isAllCompleted = useMemo(() => {
    return todoList.length > 0 && todoList.every(todo => todo.completed);
  }, [todoList]);

  return {
    isActive,
    setIsActive,
    visibleTodos,
    isAllCompleted,
  };
};

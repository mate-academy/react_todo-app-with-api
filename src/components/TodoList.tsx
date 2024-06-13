import React, { useContext, useMemo } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from '../TodosContext';
import { Filter } from '../types/Filter';

export const TodoList: React.FC = () => {
  const { todos, filtering, tempTodo } = useContext(TodosContext);

  const visibleTodos = useMemo(() => {
    switch (filtering) {
      case Filter.ALL:
        return todos;
      case Filter.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case Filter.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filtering]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo !== null && (
        <TodoItem todo={tempTodo} key={tempTodo.id} isLoading />
      )}
    </section>
  );
};

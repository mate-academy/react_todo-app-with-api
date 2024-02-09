import React from 'react';

import { useTodosContext } from '../TodosContext';

import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useTodosContext();

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};

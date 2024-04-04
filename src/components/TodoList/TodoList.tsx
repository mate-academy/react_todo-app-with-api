import React from 'react';
import { useTodos } from '../TodosProvider';
import { TodoItem } from '../TodoItem';

export const TodoList: React.FC = React.memo(function TodoList() {
  const { filteredTodos, tempTodo } = useTodos();

  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} />}
    </>
  );
});

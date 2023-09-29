import React, { useContext } from 'react';
import { TodoContext } from '../context/todoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};

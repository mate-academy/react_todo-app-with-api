import React, { useContext } from 'react';
import { TodoContext } from '../context/todoContext';
import { TodoObject } from './TodoObject';

export const TodoListSection: React.FC = () => {
  const { todos, tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoObject todo={todo} key={todo.id} />
      ))}

      {tempTodo && <TodoObject todo={tempTodo} />}
    </section>
  );
};

import React from 'react';
import TodoItem from '../TodoItem/TodoItem';
import { useTodos } from '../Store/Store';

const TodoList: React.FC = () => {
  const { filteredTodos, tempTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};

export default TodoList;

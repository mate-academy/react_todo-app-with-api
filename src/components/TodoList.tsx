import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import '../styles/todo.scss';
import '../styles/todoapp.scss';

type Props = {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todoId: number, title: string) => Promise<void>;
  toggleTodo: (todoId: number) => Promise<void>;
  isDeleting: number | null;
  isToggling: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  updateTodo,
  toggleTodo,
  isDeleting,
  isToggling,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          deleteTodo={deleteTodo}
          isDeleting={isDeleting === todo.id}
          isToggling={isToggling}
          updateTodo={updateTodo}
        />
      ))}
    </section>
  );
};

export default TodoList;

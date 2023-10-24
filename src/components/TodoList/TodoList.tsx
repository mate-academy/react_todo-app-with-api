import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  todoLoaderIndex: number;
  updateTodo: (todo: Todo, editStatus: boolean) => void;
  removeTodo: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  todoLoaderIndex,
  updateTodo = () => {},
  removeTodo = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          todoLoaderIndex={todoLoaderIndex}
          updateTodo={updateTodo}
          removeTodo={removeTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};

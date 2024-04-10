import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[];
  isSubmitting: boolean;
  deletedTodoId: number;
  handleRemoveTodo: (todoId: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isSubmitting,
  deletedTodoId,
  handleRemoveTodo,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          todo={todo}
          isSubmitting={isSubmitting}
          deletedTodoId={deletedTodoId}
          handleRemoveTodo={handleRemoveTodo}
          handleUpdateTodo={handleUpdateTodo}
          key={todo.id}
        />
      ))}
    </section>
  );
};

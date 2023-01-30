import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (id: number) => void;
  updateTodo: (id: number, field: Partial<Todo>) => void;
  areAllUpdating: boolean;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  updateTodo,
  areAllUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          areAllUpdating={areAllUpdating}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          areAllUpdating={areAllUpdating}
        />
      )}
    </section>
  );
};

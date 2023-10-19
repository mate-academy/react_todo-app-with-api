import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  removeTodo: (id: number) => void,
  loadingItems: number[],
  handleTodoClick: (id: number) => void;
  handleEdit: (todo: Todo) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  loadingItems,
  handleTodoClick,
  handleEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          isLoading={loadingItems.includes(todo.id)}
          onTodoClick={handleTodoClick}
          handleEdit={handleEdit}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          removeTodo={removeTodo}
          isLoading
          onTodoClick={handleTodoClick}
          handleEdit={handleEdit}
        />
      )}
    </section>
  );
};

import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { Filter } from '../types/Filters';
import { Errors } from '../types/Errors';
import { TodoTemporary } from './TodoTemporary';

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  handleDeleteTodo: (todo: Todo, callback: () => void) => void;
  handleCompleteTodo: (todo: Todo, callback: () => void) => void;
  handleError: (error: Errors) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  handleDeleteTodo,
  handleCompleteTodo,
  handleError,
}) => {
  const visibleTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDeleteTodo={handleDeleteTodo}
          handleCompleteTodo={handleCompleteTodo}
          handleError={handleError}
        />
      ))}
      {tempTodo && <TodoTemporary temporaryTodo={tempTodo} />}
    </section>
  );
};

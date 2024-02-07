import React from 'react';
// import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  handleUpdateTodo: (todo: Todo) => void;
  handleEdit?: (todo: Todo, newTitle: string) => Promise<void>;
  isLoading: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos, deleteTodo, handleUpdateTodo, isLoading, handleEdit,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        deleteTodo={deleteTodo}
        handleUpdateTodo={handleUpdateTodo}
        isLoading={isLoading}
        editTodo={handleEdit}
      // loading={false}
      />
    ))}
  </section>
);

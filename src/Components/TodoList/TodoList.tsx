import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Category } from '../../utils/Category';

interface Props {
  todos: Todo[],
  onDelete: (id: number) => void;
  isLoading: boolean;
  category: Category;
  onUpdate: (todoId: number) => void
  isUpdating: (todoId: number) => boolean;
}
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isLoading,
  category,
  onUpdate,
  isUpdating,
}) => {
  const visibleTodos = todos.filter(todo => {
    switch (category) {
      case Category.Active:
        return !todo.completed;
      case Category.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main">
      {visibleTodos.map((todo) => {
        const isTodoUpdated = isUpdating(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            isLoading={isLoading}
            onUpdate={onUpdate}
            isUpdating={isTodoUpdated}
          />
        );
      })}
    </section>
  );
};

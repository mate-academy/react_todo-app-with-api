import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { FilterTodo } from '../../types/Filter';

type Props = {
  todos: Todo[];
  isLoadingTodos: boolean;
  filter: FilterTodo;
  loadingTodoIds: number[];
  onToggle: (id: number) => void;
  onDeleteTodo: (id: number) => void;
  onEditTitle: (title: string, id: number) => Promise<boolean>
};
export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  loadingTodoIds,
  onToggle,
  onDeleteTodo,
  onEditTitle
}) => {
  const filteredTodos = todos.filter(todo => {
    if (filter === FilterTodo.All) {
      return true;
    }

    if (filter === FilterTodo.Active) {
      return !todo.completed;
    }

    return todo.completed;
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoadingTodos={loadingTodoIds.includes(todo.id)}
          onToggle={onToggle}
          onDeleteTodo={onDeleteTodo}
          onEditTitle={onEditTitle}
        />
      ))}
    </section>
  );
};

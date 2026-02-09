import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  updatingTodoId: number[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onUpdate: (todo: Todo, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updatingTodoId,
  tempTodo,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  if (todos.length === 0 && !tempTodo) {
    return null;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={updatingTodoId.includes(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onToggle={() => onToggle(todo)}
          onUpdate={title => onUpdate(todo, title)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          onDelete={() => onDelete(tempTodo.id)}
          onToggle={() => {}}
          onUpdate={() => {}}
        />
      )}
    </section>
  );
};

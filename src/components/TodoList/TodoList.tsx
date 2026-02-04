import React from 'react';
import { Todo } from '../../type/Todo';
import { TodoListItem } from '../TodoListItem/TodoListItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  processingsIds: number[];
  onUpdate: (todo: Todo) => Promise<void>;
  onToggle: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete = () => {},
  processingsIds,
  onUpdate,
  onToggle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={processingsIds.includes(todo.id)}
          onUpdate={onUpdate}
          onToggle={onToggle}
        />
      ))}

      {tempTodo && <TodoListItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};

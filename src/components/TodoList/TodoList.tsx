import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  editTodos: number[];
  onToggle: (id: number, completed: boolean) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  editTodos,
  onToggle,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          editTodos={editTodos}
          onToggle={onToggle}
          onUpdate={onUpdate}
        />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

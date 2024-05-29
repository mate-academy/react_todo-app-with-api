import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  changingIDs: number[];
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => void;
  onRename: (id: number, title: string) => Promise<void>;
  onEmptyTitleDelete: () => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  changingIDs,
  onDelete,
  onToggle,
  onRename,
  onEmptyTitleDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        changingIDs={changingIDs}
        onDelete={onDelete}
        onToggle={onToggle}
        onRename={onRename}
        onEmptyTitleDelete={onEmptyTitleDelete}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} changingIDs={changingIDs} />}
  </section>
);

import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  waitForResponseIds: number[];
  updateTodo: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  waitForResponseIds,
  updateTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        waitForResponseIds={waitForResponseIds}
        onToggle={updateTodo}
        onRename={updateTodo}
      />
    ))}

    {tempTodo && <TempTodo title={tempTodo.title} />}
  </section>
);

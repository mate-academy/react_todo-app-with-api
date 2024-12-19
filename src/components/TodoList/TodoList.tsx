import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  todosInProcess: number[];
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todosInProcess,
  onUpdate,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todosInProcess={todosInProcess}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && <TempTodo tempTitle={tempTodo} />}
    </section>
  );
};

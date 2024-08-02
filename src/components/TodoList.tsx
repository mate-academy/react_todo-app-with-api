/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

interface Props {
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<Todo>) => Promise<void>;
  todos: Todo[];
  tempTodoTitle: string | null;
  idsProccesing: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodoTitle,
  onDelete,
  onEdit,
  idsProccesing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          idsProccesing={idsProccesing}
        />
      ))}

      {tempTodoTitle && <TempTodo title={tempTodoTitle} />}
    </section>
  );
};

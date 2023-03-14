import React from 'react';
import { TodoType } from '../../types/TodoType';
import { TodoInfo } from '../TodoInfo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null | undefined;
  isRemoveAll: boolean;
  isToggleAll: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, completed?: boolean, title?: string) => void;
};

export const Section: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onUpdate,
  isRemoveAll,
  isToggleAll,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isRemoveAll={isRemoveAll}
          isToggleAll={isToggleAll}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};

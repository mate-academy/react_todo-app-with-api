import React, { } from 'react';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { UpdatingData } from '../../types/UpdatingData';

type Props = {
  todos: Todo[];
  isDisableInput: boolean;
  tempTodo: Todo | null;
  selectedTodoId: number[];
  onUpdate: (
    { todo, key, value }: UpdatingData,
    setIsActiveInput: (value: boolean) => void,
  ) => void;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isDisableInput,
  tempTodo,
  selectedTodoId,
  onUpdate,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoId={selectedTodoId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isDisableInput={isDisableInput}
        />
      )}
    </section>
  );
};

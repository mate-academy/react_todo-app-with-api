import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

/* eslint-disable*/
type Props = {
  visibleToDos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updated: Partial<Todo>) => Promise<void>;
  tempTodo: Todo | null;
  isAllLoading: boolean;
};
/* eslint-enable*/
export const ToDoList: React.FC<Props> = ({
  visibleToDos,
  onDelete,
  onUpdate,
  tempTodo,
  isAllLoading,
}) => {
  const renderToDos = useMemo(
    () => (tempTodo ? [...visibleToDos, tempTodo] : visibleToDos),
    [visibleToDos, tempTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {renderToDos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          isTempToDo={todo.id === 0}
          isAllLoading={isAllLoading}
        />
      ))}
    </section>
  );
};

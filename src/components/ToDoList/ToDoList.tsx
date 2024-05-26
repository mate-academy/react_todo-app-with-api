import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { ToDoItem } from '../ToDoItem/ToDoItem';

type Props = {
  visibleToDos: Todo[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updated: Partial<Todo>) => Promise<void>;
  tempTodo: Todo | null;
  isAllLoading: boolean;
};

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
        <ToDoItem
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

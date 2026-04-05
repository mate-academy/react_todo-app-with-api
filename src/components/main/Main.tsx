import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../todo/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handlerDeleteTodo: (id: number) => void;
  deleting: number | null;
  handleUpdateTodo: (todo: Todo) => void;
  updatingIds: number[];
  editingId: number | null;
  setEditingId: (event: number) => void;
};

export const Main: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handlerDeleteTodo,
  deleting,
  handleUpdateTodo,
  updatingIds,
  editingId,
  setEditingId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(toDo => {
        return (
          <TodoItem
            key={toDo.id}
            toDo={toDo}
            isLoading={false}
            handlerDeleteTodo={handlerDeleteTodo}
            deleting={deleting === toDo.id}
            handleUpdateTodo={handleUpdateTodo}
            isUpdating={updatingIds.includes(toDo.id)}
            editingId={editingId}
            setEditingId={setEditingId}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          key={0}
          toDo={tempTodo}
          isLoading={true}
          isUpdating={true}
          handlerDeleteTodo={handlerDeleteTodo}
          deleting={deleting === 0}
          handleUpdateTodo={handleUpdateTodo}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      )}
    </section>
  );
};

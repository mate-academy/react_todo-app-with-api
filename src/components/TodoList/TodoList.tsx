import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  handleDeleteTodo: (todoId: number) => void;
  deletingTodoIds: number[];
  updateTodoStatus: (todo: Todo) => void;
  updatingTodoIds: number[];
  onRename: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  handleDeleteTodo,
  deletingTodoIds,
  updateTodoStatus,
  updatingTodoIds,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={
            deletingTodoIds.includes(todo.id) ||
            updatingTodoIds.includes(todo.id)
          }
          onDelete={handleDeleteTodo}
          onToggle={updateTodoStatus}
          onRename={onRename}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};

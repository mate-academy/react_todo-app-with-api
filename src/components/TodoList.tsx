import React from 'react';
import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  todoId: number[];
  onDelete: (id: number) => void;
  onChangeStatus: (todo: Todo) => void;
  onRename: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  todoId,
  onDelete,
  onChangeStatus,
  onRename,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isTodoLoading = todoId.some(id => id === todo.id);

        return (
          <TodoComponent
            key={todo.id}
            todo={todo}
            isLoading={isTodoLoading}
            onDelete={onDelete}
            changeStatus={onChangeStatus}
            onRename={onRename}
          />
        );
      })}

      {tempTodo && (
        <TodoComponent
          todo={tempTodo}
          isLoading={true}
          onDelete={onDelete}
          changeStatus={onChangeStatus}
          onRename={onRename}
        />
      )}
    </section>
  );
};

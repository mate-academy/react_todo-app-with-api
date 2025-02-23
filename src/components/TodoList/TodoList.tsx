import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoBody } from '../TodoBody/TodoBody';
import { Errors } from '../../utils/Errors';
import { TodoOmited } from '../../types/TodoOmited';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (id: number[]) => Promise<void[]>;
  onErrorMessageChange: (error: Errors) => void;
  onUpdateTodo: (todosToUpdate: TodoOmited[]) => Promise<void[]>;
  pendingTodosId: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  onErrorMessageChange,
  onUpdateTodo,
  pendingTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoBody
          onErrorMessageChange={onErrorMessageChange}
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          onUpdateTodo={onUpdateTodo}
          pendingTodosId={pendingTodosId}
        />
      ))}

      {!!tempTodo && (
        <TodoBody
          onErrorMessageChange={onErrorMessageChange}
          onDeleteTodo={onDeleteTodo}
          todo={tempTodo}
          onUpdateTodo={onUpdateTodo}
          pendingTodosId={pendingTodosId}
        />
      )}
    </section>
  );
};

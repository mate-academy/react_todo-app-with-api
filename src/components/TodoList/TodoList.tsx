import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  onTodoDelete:(todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  onChangeTodo:(todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  newTodoField:React.RefObject<HTMLInputElement>;
  isUpdating:boolean
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onTodoDelete,
  tempTodo,
  newTodoField,
  onChangeTodo,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          onDelete={onTodoDelete}
          onChangeTodo={onChangeTodo}
          newTodoField={newTodoField}
          isUpdating={isUpdating}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          onDelete={onTodoDelete}
          onChangeTodo={onChangeTodo}
          newTodoField={newTodoField}
          isUpdating={isUpdating}
          temporary
        />
      )}
    </section>
  );
});

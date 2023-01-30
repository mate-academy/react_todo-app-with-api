import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

type Props = {
  todos: Todo[];
  removeTodo:(todoId: number) => Promise<void>;
  tempTodo: Todo | null;
  changeTodo:(todoId: number, fieldsToUpdate: Partial<Todo>) => Promise<void>;
  newTodoField:React.RefObject<HTMLInputElement>;
  isUpdating:boolean
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  removeTodo,
  tempTodo,
  newTodoField,
  changeTodo,
  isUpdating,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
          newTodoField={newTodoField}
          isUpdating={isUpdating}
        />
      ))}

      {tempTodo && (
        <TodoInfo
          todo={tempTodo}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
          newTodoField={newTodoField}
          isUpdating={isUpdating}
          temporary
        />
      )}
    </section>
  );
});

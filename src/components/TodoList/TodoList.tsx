import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>;
  selectedTodoIds: number[];
  removeTodo: (todoId: number) => void;
  changeTodo:(id: number, itemsToUpdate: Partial<Todo>) => void;
  toggleTodo: (id: number, statusTodo: boolean) => void;
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  selectedTodoIds,
  removeTodo,
  changeTodo,
  newTodoField,
  toggleTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          newTodoField={newTodoField}
          selectedTodoIds={selectedTodoIds}
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
          changeTodo={changeTodo}
        />
      ))}
    </section>
  );
});

import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  selectedTodoIds: number[],
  newTodoField: React.RefObject<HTMLInputElement>;
  removeTodo: (todoId: number) => void;
  toggleTodoStatus: (todoId: number, status: boolean) => void;
  updateTodo: (todoId: number, newData: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = memo((props) => {
  const {
    todos,
    removeTodo,
    toggleTodoStatus,
    selectedTodoIds,
    newTodoField,
    updateTodo,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodoIds={selectedTodoIds}
          removeTodo={removeTodo}
          toggleTodoStatus={toggleTodoStatus}
          newTodoField={newTodoField}
          updateTodo={updateTodo}
        />
      ))}
    </section>
  );
});

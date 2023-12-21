import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  selectedTodoIds: number[],
  onDelete: (todoId: number) => void,
  onError: (error: ErrorType) => void,
  updateTodo: (updatedTodo: Todo) => void,
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  selectedTodoIds,
  onDelete,
  onError,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            selectedTodoIds={selectedTodoIds}
            onDelete={onDelete}
            onError={onError}
            updateTodo={updateTodo}
            key={todo.id}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          selectedTodoIds={selectedTodoIds}
          onDelete={() => {}}
          onError={() => {}}
          updateTodo={() => {}}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};

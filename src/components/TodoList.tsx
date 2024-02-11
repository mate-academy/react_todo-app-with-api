import React from 'react';
import { Todo } from '../types/Todo';
import { OneTodo } from './OneTodo';

interface Props {
  todos: Todo[],
  tempTodo?: Todo | null,
  onDeleteTodo?: (todoId: number) => void,
  processingTodoIds: number[],
  onUpdateTodo: (updatedTodo: Todo) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  processingTodoIds,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <OneTodo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            processingTodoIds={processingTodoIds}
            onUpdateTodo={onUpdateTodo}
          />
        );
      })}
      {tempTodo && (
        <OneTodo
          key={tempTodo.id}
          todo={tempTodo}
          processingTodoIds={processingTodoIds}
        />
      )}
    </section>
  );
};

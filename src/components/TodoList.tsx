import React from 'react';
import { Todo } from '../types/Todo';
import { SingleTodo } from './SingleTodo';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDeleteTodo: (todoId: number) => Promise<void>
  isTodoLoading: (id: number) => boolean,
  onUpdateTodo: (id: number, todoData: Partial<Todo>) => Promise<void>,
  showError: React.Dispatch<React.SetStateAction<string>>,
}

export const TodoList: React.FC<Props> = React.memo(
  ({
    todos,
    tempTodo,
    onDeleteTodo,
    isTodoLoading,
    onUpdateTodo,
    showError,
  }) => {
    return (
      <section className="todoapp__main">
        {todos.map(todo => (
          <SingleTodo
            todo={todo}
            onDelete={onDeleteTodo}
            isLoading={isTodoLoading(todo.id)}
            onUpdateTodo={onUpdateTodo}
            error={showError}
          />
        ))}
        {tempTodo && (
          <SingleTodo
            todo={tempTodo}
            onDelete={onDeleteTodo}
            isLoading={isTodoLoading(tempTodo.id)}
            onUpdateTodo={onUpdateTodo}
            error={showError}
          />
        )}
      </section>
    );
  },
);

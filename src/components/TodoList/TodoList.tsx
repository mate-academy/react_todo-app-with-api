import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  isAdding: boolean;
  onUpdateTodo: (
    todoId: number,
    fieldsToUpdate: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => void;
  updatingTodosIds: number[];
};

export const TodoList: React.FC<Props> = memo(
  ({
    todos,
    onDeleteTodo,
    tempTodo,
    isAdding,
    onUpdateTodo,
    updatingTodosIds,
  }) => {
    return (
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map((todo) => (
          <TodoInfo
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onUpdateTodo={onUpdateTodo}
            shouldShowLoader={updatingTodosIds.includes(todo.id)}
          />
        ))}

        {tempTodo && (
          <TodoInfo
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            isAdding={isAdding}
            onUpdateTodo={onUpdateTodo}
          />
        )}
      </section>
    );
  },
);

import React from 'react';

import { Todo as TodoType, Todo } from '../../types/Todo';
import { Todo as TodoItem } from '../Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  className?: string;
  deleteTodo?: (todoId: number) => Promise<unknown>;
  clearErrorMessage: () => void;
  updatingTodoIds: number[];
  onChangeTodoCompleteness?: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<TodoType | void>;
  onRenamingTodo: (todoId: number, title: string) => Promise<TodoType | void>;
};

const TodoListBase: React.FC<Props> = ({
  todos,
  tempTodo,
  className,
  deleteTodo,
  clearErrorMessage,
  updatingTodoIds,
  onChangeTodoCompleteness,
  onRenamingTodo,
}) => {
  return (
    <section className={className} data-cy="TodoList">
      <div>
        {todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              deleteTodo={deleteTodo}
              clearErrorMessage={clearErrorMessage}
              isUpdating={updatingTodoIds.includes(todo.id)}
              onChangeTodoCompleteness={onChangeTodoCompleteness}
              onRenamingTodo={onRenamingTodo}
            />
          );
        })}
        {tempTodo && (
          <TodoItem key={tempTodo.id} todo={tempTodo} isUpdating={true} />
        )}
      </div>
    </section>
  );
};

export const TodoList = React.memo(TodoListBase);

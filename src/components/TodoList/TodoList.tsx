import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask/TodoTask';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  updatedTodosId: number[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  fetchUpdateTodoCompleted: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  fetchUpdateTodoTitle: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  updatedTodosId,
  onDeleteTodo,
  fetchUpdateTodoCompleted,
  fetchUpdateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoTask
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            isLoading={updatedTodosId.includes(todo.id)}
            fetchUpdateTodoCompleted={fetchUpdateTodoCompleted}
            fetchUpdateTodoTitle={fetchUpdateTodoTitle}
          />
        );
      })}

      {!!tempTodo && (
        <TodoTask
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading={true}
          fetchUpdateTodoCompleted={fetchUpdateTodoCompleted}
          fetchUpdateTodoTitle={fetchUpdateTodoTitle}
        />
      )}
    </section>
  );
};

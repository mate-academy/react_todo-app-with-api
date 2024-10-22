import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask/TodoTask';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  updatedTodosId: number[];
  onDeleteTodo: (todoId: number) => Promise<void>;
  onUpdateTodoCompleted: (
    todoId: number,
    isCompleted: boolean,
  ) => Promise<void>;
  onUpdateTodoTitle: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  updatedTodosId,
  onDeleteTodo,
  onUpdateTodoCompleted,
  onUpdateTodoTitle,
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
            onUpdateTodoCompleted={onUpdateTodoCompleted}
            onUpdateTodoTitle={onUpdateTodoTitle}
          />
        );
      })}

      {!!tempTodo && (
        <TodoTask
          todo={tempTodo}
          onDeleteTodo={onDeleteTodo}
          isLoading={true}
          onUpdateTodoCompleted={onUpdateTodoCompleted}
          onUpdateTodoTitle={onUpdateTodoTitle}
        />
      )}
    </section>
  );
};

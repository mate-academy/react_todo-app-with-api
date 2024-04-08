import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodos: Todo[];
  onTodoDelete: (todoId: number) => void;
  onTodoCheck: (todo: Todo) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const TodoAppMain: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoCheck,
  processingTodos,
  onTodoUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        onTodoCheck={onTodoCheck}
        key={todo.id}
        todo={todo}
        isUpdating={processingTodos.some(
          todoInProcess => todoInProcess.id === todo.id,
        )}
        onTodoDelete={onTodoDelete}
        onTodoUpdate={onTodoUpdate}
      />
    ))}
    {tempTodo && (
      <TodoItem
        todo={tempTodo}
        isTempTodo={true}
        onTodoDelete={onTodoDelete}
        onTodoCheck={onTodoCheck}
        onTodoUpdate={onTodoUpdate}
      />
    )}
  </section>
);

import React from 'react';
import { Todo } from '../../types/Todo';
import { Item } from '../Item';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodos: Todo[];
  onTodoDelete: (todoId: number) => void;
  onTodoCheck: (todo: Todo) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoCheck,
  processingTodos,
  onTodoUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <Item
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
      <Item
        todo={tempTodo}
        isTempTodo={true}
        onTodoDelete={onTodoDelete}
        onTodoCheck={onTodoCheck}
        onTodoUpdate={onTodoUpdate}
      />
    )}
  </section>
);

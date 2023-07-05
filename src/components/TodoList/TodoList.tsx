import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  onDeleteTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  onUpdateTodo: (todoToUpdate: Todo, newTitle?: string) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDeleteTodo,
  loadingTodoIds,
  onUpdateTodo,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        loadingTodoId={loadingTodoIds.includes(todo.id)
          ? todo.id : null}
        onUpdateTodo={onUpdateTodo}
      />
    ))}
  </section>
));

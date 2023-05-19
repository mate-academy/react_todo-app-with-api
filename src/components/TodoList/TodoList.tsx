import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  completedTodosId: number[];
  onUpdate: (todoId: number, completedStatus: boolean) => void;
  isUpdatingTodoId: number | null;
  isUpdating: boolean;
  onUpdateTodoTitle: (todoId: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  completedTodosId,
  onUpdate,
  isUpdatingTodoId,
  isUpdating,
  onUpdateTodoTitle,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDeleteTodo={onDeleteTodo}
          isCompleted={completedTodosId.includes(todo.id)}
          onUpdate={onUpdate}
          isUpdatingTodoId={isUpdatingTodoId}
          isUpdating={isUpdating}
          onUpdateTodoTitle={onUpdateTodoTitle}
        />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

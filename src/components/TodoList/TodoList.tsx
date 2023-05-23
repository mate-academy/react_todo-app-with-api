import { memo, FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  isClearCompletedTodos: boolean;
  isEditingTodos: boolean;
  onUpdateCompleted: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  loadTodos: () => void;
}

export const TodoList: FC<Props> = memo(({
  todos,
  isClearCompletedTodos,
  isEditingTodos,
  onUpdateCompleted,
  onDelete,
  loadTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          isClearCompletedTodos={isClearCompletedTodos}
          isEditingTodos={isEditingTodos}
          onUpdateCompleted={onUpdateCompleted}
          onDelete={onDelete}
          loadTodos={loadTodos}
          todos={todos}
          key={todo.id}
        />
      ))}
    </section>
  );
});

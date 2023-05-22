import { FC } from 'react';
import { Todo, TodoStatus, TodoTitle } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null,
  isloadingId: number;
  onDelete: (todoId: number) => void;
  onEdit: (todoId: number, data: TodoTitle | TodoStatus) => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  isloadingId,
  onDelete: handleDeleteTodo,
  onEdit: handlePatchTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isloadingId={isloadingId}
          onDelete={handleDeleteTodo}
          onEdit={handlePatchTodo}
        />
      ))}

      {tempTodo && (
        <TempTodo
          todo={tempTodo}
        />
      )}
    </section>
  );
};

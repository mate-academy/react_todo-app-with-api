import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  onUpdate: (id: number, status: boolean, title:string) => void;
  loadingIds: number[];
  editTodo: (id:number, data: Partial<Todo>) => void
  // setTodos: () => void;
}

export const TodoList: FC<Props> = ({
  todos,
  tempTodo,
  onUpdate,
  onDelete,
  loadingIds,
  editTodo,
  // setTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingIds={loadingIds}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editTodo={editTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          loadingIds={loadingIds}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editTodo={editTodo}
        />
      )}

    </section>
  );
};

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC } from 'react';
import { TodoType } from '../Types/TodoType';
import { Todo } from './Todo';
interface Props {
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, data: Partial<TodoType>) => Promise<void>;
  todos: TodoType[];
  tempTodo: TodoType | null;
  idsProccesing: number[];
}
export const List: FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onEdit,
  idsProccesing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onEdit={onEdit}
          idsProccesing={idsProccesing}
        />
      ))}
      {/* Pass props in a single line to TempTodo */}
      {tempTodo && (
        <Todo
          todo={tempTodo}
          onDelete={onDelete}
          onEdit={onEdit}
          idsProccesing={idsProccesing}
        />
      )}
    </section>
  );
};

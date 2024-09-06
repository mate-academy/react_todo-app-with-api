import { Todo } from '../../types/Todo';
import { ToDo } from '../todo/todo';

type Props = {
  list: Todo[];
  idTodo: number;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  onLoading: (status: boolean) => void;
  onError: (status: string) => void;
  onIdTodo: (id: number) => void;
};

export const ToDoList: React.FC<Props> = ({
  list,
  idTodo,
  onDelete,
  onUpdate,
  onLoading,
  onError,
  onIdTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(todo => (
        <ToDo
          list={list}
          todo={todo}
          key={todo.id}
          idTodo={idTodo}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onLoading={onLoading}
          onError={onError}
          onIdTodo={onIdTodo}
        />
      ))}
    </section>
  );
};

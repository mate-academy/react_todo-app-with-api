import { Todo } from '../types/Todo';
import '../styles/todo.scss';
import '../styles/todoapp.scss';
import { TempTodo } from './TempTodo';
import { RegularTodo } from './RegularTodo';

type Props = {
  todos: Todo[];
  tempTodo?: Todo | null;
  deletingTodoId: number | null;
  idsProccesing: number[];
  errorProccesing: (message: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<Todo>) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoId,
  idsProccesing,
  onDelete,
  onEdit,
  errorProccesing,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <RegularTodo
          todo={todo}
          deletingTodoId={deletingTodoId}
          idsProccesing={idsProccesing}
          onDelete={onDelete}
          onEdit={onEdit}
          onError={errorProccesing}
          key={todo.id}
        />
      ))}

      {tempTodo && <TempTodo todo={tempTodo} />}
    </section>
  );
};

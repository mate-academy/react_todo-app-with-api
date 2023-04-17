import { TodoInterface } from '../../types/todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoInterface[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: TodoInterface | undefined;
  onUpdateTodo: (id: number, data: Partial<TodoInterface>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  temporaryTodo,
  onUpdateTodo,
}) => (
  <>
    {todos.map((todo) => (
      <Todo
        todo={todo}
        key={todo.id}
        onDelete={onDeleteTodo}
        onUpdate={onUpdateTodo}
      />
    ))}
    {temporaryTodo && (
      <Todo
        todo={temporaryTodo}
        key={temporaryTodo.id}
        onDelete={onDeleteTodo}
        onUpdate={onUpdateTodo}
      />
    )}
  </>
);

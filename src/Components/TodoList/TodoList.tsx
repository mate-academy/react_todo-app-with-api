import { Todos } from "../../types/todo";
import { Todo } from "../Todo/Todo";

type Props = {
  todos: Todos[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: Todos | undefined;
  onUpdateTodo: (id: number, data: Partial<Todos>) => void;
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

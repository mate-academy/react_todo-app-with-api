import { TodoInterface } from "../../types/Todo";
import { Todo } from "../Todo/Todo";

type Props = {
  todos: TodoInterface[];
  onDeleteTodo: (id: number) => void;
  temporaryTodo: TodoInterface | undefined;
  onUpdateTodo: (id: number, data: Partial<TodoInterface>) => void;
  loadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  temporaryTodo,
  onUpdateTodo,
  loadingIds,
}) => (
  <>
    {todos.map((todo) => {
      const isLoading = loadingIds.some((id) => id === todo.id);

      return (
        <Todo
          todo={todo}
          key={todo.id}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
          isLoading={isLoading}
        />
      );
    })}
    {temporaryTodo && (
      <Todo
        todo={temporaryTodo}
        key={temporaryTodo.id}
        onDelete={onDeleteTodo}
        onUpdate={onUpdateTodo}
        isLoading
      />
    )}
  </>
);

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
  activeTodoIds: number[];
  onStatusChange: (todo: Todo) => void;
  setError: (error: string) => void;
  onTodoEdit: (editedTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  activeTodoIds,
  onStatusChange,
  setError,
  onTodoEdit,
}) => (
  <>
    {todos.map(todo => {
      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          activeTodoIds={activeTodoIds}
          onStatusChange={onStatusChange}
          setError={setError}
          onTodoEdit={onTodoEdit}
        />
      );
    })}
    {tempTodo && (
      <TodoItem
        onTodoDelete={onTodoDelete}
        todo={tempTodo}
        onStatusChange={onStatusChange}
        setError={setError}
        onTodoEdit={onTodoEdit}
      />
    )}
  </>
);

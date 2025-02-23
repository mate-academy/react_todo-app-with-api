import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  toggleTodo: (todoToUpdate: Todo) => Promise<void>;
  renameTodo: (todoToRename: Todo, newTitle: string) => void;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  tempTodo,
  toggleTodo,
  renameTodo,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          toggleTodo={toggleTodo}
          renameTodo={renameTodo}
          processingIds={processingIds}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={() => {}}
          toggleTodo={() => {}}
          renameTodo={() => {}}
        />
      )}
    </section>
  );
};

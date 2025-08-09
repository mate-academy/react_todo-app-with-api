import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  processingTodoIds: number[];
  tempTodo: Todo | null;
  handleEditTodo: (todo: Todo) => Promise<boolean>;
  onToggleStatus: (todo: Todo) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  processingTodoIds,
  tempTodo,
  handleEditTodo,
  inputRef,
  onToggleStatus = () => {},
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={processingTodoIds.includes(todo.id)}
          handleEditTodo={handleEditTodo}
          inputRef={inputRef}
          onToggleStatus={onToggleStatus}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading inputRef={inputRef} />}
    </section>
  );
};

import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todo: Todo) => void;
  tempTodo: Todo | null;
  onEditStatus: (todoToEdit: Todo, status: boolean) => void;
  onEditTitle: (todoToEdit: Todo, title: string) => void;
  processedTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  onEditStatus,
  onEditTitle,
  processedTodos,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        onEditStatus={onEditStatus}
        onEditTitle={onEditTitle}
        processedTodos={processedTodos}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onDelete={onDelete}
        onEditStatus={onEditStatus}
        onEditTitle={onEditTitle}
        processedTodos={processedTodos}
      />
    )}
  </section>
);

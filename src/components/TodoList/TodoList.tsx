import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  tempTodo: Todo | null,
  todos:Todo[],
  handleDeleteTodo: (id: number) => void,
  handleUpdateStatus: (id: number) => void,
  handleUpdateTitle: (id: number, newTitle: string) => void,
  processing: number[],
}

export const TodoList: React.FC<Props> = ({
  tempTodo,
  todos,
  handleDeleteTodo,
  handleUpdateStatus,
  handleUpdateTitle,
  processing,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdateTitle={handleUpdateTitle}
          processing={processing}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdateTitle={handleUpdateTitle}
          processing={processing}
        />
      )}
    </section>
  );
};

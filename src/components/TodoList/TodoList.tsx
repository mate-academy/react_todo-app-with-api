import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoToDelete: Todo) => void;
  onCompleteUpdate: (todoId: number, completed: boolean) => void;
  onTitleUpdate: (todoId: number, title: string) => void;
  isLoading: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  onCompleteUpdate,
  onTitleUpdate,
  isLoading,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onCompleteUpdate={onCompleteUpdate}
          onTitleUpdate={onTitleUpdate}
          isLoading={isLoading}
        />
      ))}

      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

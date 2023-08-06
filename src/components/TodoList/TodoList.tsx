import { Todo } from '../../types/Todo';
import { TempTodo } from '../TempTodo/TempTodo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodoIds: number[];
  onDelete: (todoToDelete: Todo) => void;
  onCompleteUpdate: (todoId: number, completed: boolean) => void;
  onTitleUpdate: (todoId: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodoIds,
  onDelete,
  onCompleteUpdate,
  onTitleUpdate,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          loadingTodoIds={loadingTodoIds}
          onDelete={onDelete}
          onCompleteUpdate={onCompleteUpdate}
          onTitleUpdate={onTitleUpdate}
        />
      ))}

      {tempTodo?.id === 0 && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

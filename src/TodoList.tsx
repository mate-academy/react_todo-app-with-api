import { TodoInfo } from './TodoInfo';
import { TempItem } from './TempItem';
import { Todo } from './types/Todo';

type Props = {
  todosToShow: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
  onStatusChange: (todo: Todo) => void,
  onTitleChange: (todo: Todo, todoTitle: string) => void,
  loadingTodos: number[],
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  onDelete,
  onStatusChange,
  onTitleChange,
  loadingTodos,
}) => {
  return (
    <ul className="todoapp__main">
      {todosToShow.map(todo => (
        <TodoInfo
          todo={todo}
          onDelete={onDelete}
          key={todo.id}
          onStatusChange={onStatusChange}
          onTitleChange={onTitleChange}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}
      {tempTodo && <TempItem tempTodo={tempTodo} />}
    </ul>
  );
};

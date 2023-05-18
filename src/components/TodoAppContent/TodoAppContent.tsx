import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  onCompletedToggle: (id: number, isCompleted: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  tempTodo,
  onDelete,
  onCompletedToggle,
  onTitleChange,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
        />
      )}
    </section>
  );
};

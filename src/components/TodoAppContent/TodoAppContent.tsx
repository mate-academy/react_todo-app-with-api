import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todoList: Todo[];
  tempTodo: Todo | null;
  areAlledited: boolean;
  areCompletedDel: boolean;
  editedId: number | null;
  deletedId: number | null;
  onDelete: (id: number) => void;
  onCompletedToggle: (id: number, isCompleted: boolean) => void;
  onTitleChange: (id: number, title: string) => void;
};

export const TodoAppContent: React.FC<Props> = ({
  todoList,
  tempTodo,
  areAlledited,
  areCompletedDel,
  editedId,
  deletedId,
  onDelete,
  onCompletedToggle,
  onTitleChange,
}) => {
  return (
    <section className="todoapp__main">
      {todoList.map(todo => (
        <TodoItem
          todo={todo}
          areAlledited={areAlledited}
          areCompletedDel={areCompletedDel}
          editedId={editedId}
          deletedId={deletedId}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          areAlledited={areAlledited}
          areCompletedDel={areCompletedDel}
          editedId={editedId}
          deletedId={deletedId}
          onDelete={onDelete}
          onCompletedToggle={onCompletedToggle}
          onTitleChange={onTitleChange}
        />
      )}
    </section>
  );
};

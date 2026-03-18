import { Todo } from './Todo';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (id: number) => void;
  deletingIds: number[];
  onToggle: (todo: TodoType) => void;
  updatingIds: number[];
  editingId: number | null;
  editedTitle: string;
  setEditedTitle: (value: string) => void;
  setEditingId: (id: number | null) => void;
  onRename: (todo: TodoType, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingIds,
  onToggle,
  updatingIds,
  setEditedTitle,
  setEditingId,
  editingId,
  editedTitle,
  onRename
}) => {
  return (
    <>
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={
            deletingIds.includes(todo.id) || updatingIds.includes(todo.id)
          }
          onToggle={onToggle}
          setEditedTitle={setEditedTitle}
          setEditingId={setEditingId}
          // editedTitle={editedTitle}
          editedTitle={editingId === todo.id ? editedTitle : todo.title}
          editingId={editingId}
          onRename={onRename}
        />
      ))}

      {tempTodo && (
        <Todo
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          isLoading
          onToggle={onToggle}
          editingId={null}
          editedTitle=""
          setEditingId={() => {}}
          setEditedTitle={() => {}}
          onRename={() => {}}
        />
      )}
    </>
  );
};

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodos: Todo[],
  handleTodoStatus: (todoId: number, completed: boolean) => void,
  isEditing: number | null,
  editingHandler: (id: number) => void,
  editingTitle: string,
  setEditingTitle: (title: string) => void,
  cancelEdit: (event: React.KeyboardEvent<HTMLInputElement>) => void,
  setIsEditing: (id: number) => void,
  deleteTodo: (id: number) => void,
  isInProcces: number[],
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  handleTodoStatus,
  isEditing,
  editingHandler,
  editingTitle,
  setEditingTitle,
  cancelEdit,
  setIsEditing,
  deleteTodo,
  isInProcces,
}) => {
  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem
          handleTodoStatus={handleTodoStatus}
          isEditing={isEditing}
          editingHandler={editingHandler}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          cancelEdit={cancelEdit}
          setIsEditing={setIsEditing}
          deleteTodo={deleteTodo}
          isInProcces={isInProcces}
          todo={todo}
        />
      ))}
    </>
  );
};

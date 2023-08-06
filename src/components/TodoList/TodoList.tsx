import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[],
  onDelete: (todoId: number) => void,
  isLoading: boolean,
  isActiveIds: number[],
  tempTodo: Todo | null,
  toggleTodoCompleted: (todoId: number) => void,
  editMode: boolean,
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedTodo: (todo: Todo | null) => void,
  selectedTodo: Todo | null,
  updateTodo: (todoId: number, updatedTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  isLoading,
  isActiveIds,
  toggleTodoCompleted,
  setSelectedTodo,
  selectedTodo,
  setEditMode,
  updateTodo,
}) => {
  return (
    <>
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          isLoading={isLoading}
          isActiveIds={isActiveIds}
          toggleTodoCompleted={toggleTodoCompleted}
          setEditMode={setEditMode}
          setSelectedTodo={setSelectedTodo}
          selectedTodo={selectedTodo}
          updateTodo={updateTodo}
        />
      ))}
    </>
  );
};

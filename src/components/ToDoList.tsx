import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  filteredTodos: Todo[];
  deleteTodoById: number[];
  updatingTodoIds: number[];
  handleToggleTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  editingTodoId: number | null;
  setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
  handleUpdateTodoTitle: (id: number, newTitle: string) => Promise<void>;
}

export const ToDoList: React.FC<Props> = ({
  filteredTodos,
  deleteTodoById,
  updatingTodoIds,
  handleToggleTodo,
  handleDeleteTodo,
  tempTodo,
  editingTodoId,
  setEditingTodoId,
  handleUpdateTodoTitle,
}) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {filteredTodos.map(todo => {
          const isProcessing =
            deleteTodoById.includes(todo.id) ||
            updatingTodoIds.includes(todo.id);

          return (
            <TodoItem
              key={todo.id}
              todo={todo}
              handleToggleTodo={handleToggleTodo}
              handleDeleteTodo={handleDeleteTodo}
              isProcessing={isProcessing}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              handleUpdateTodoTitle={handleUpdateTodoTitle}
            />
          );
        })}
      </section>

      {tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          handleToggleTodo={() => {}}
          handleDeleteTodo={() => {}}
          isProcessing={true}
          editingTodoId={null}
          setEditingTodoId={() => {}}
          handleUpdateTodoTitle={async () => {}}
        />
      )}
    </>
  );
};

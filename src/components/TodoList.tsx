import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface PropsTodoList {
  todos: Todo[];
  processingTodoIds: number[];
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  handleToggleTodo: (todo: Todo) => void;
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  handleUpdateTodo: (todo: Todo, newTitle: string) => void;
}

export const TodoList = ({
  todos,
  processingTodoIds,
  tempTodo,
  handleDeleteTodo,
  handleToggleTodo,
  editingTodoId,
  setEditingTodoId,
  handleUpdateTodo,
}: PropsTodoList) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggleTodo={handleToggleTodo}
          processingTodoIds={processingTodoIds}
          editingTodoId={editingTodoId}
          handleUpdateTodo={handleUpdateTodo}
          setEditingTodoId={setEditingTodoId}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          handleToggleTodo={() => {}}
          handleDeleteTodo={() => {}}
          handleUpdateTodo={() => {}}
          setEditingTodoId={() => {}}
          processingTodoIds={[]}
          editingTodoId={null}
          isTemp={true}
        />
      )}
    </section>
  );
};

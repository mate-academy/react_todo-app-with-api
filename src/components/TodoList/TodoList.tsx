import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleRemoveButton: (id: number) => void;
  loadingsIds: number[];
  toggleTodo: (id: number) => void;
  setEditingTodoId: (id: number | null) => void;
  editingTodoId: number | null;
  handleEditing: (id: number) => void;
  handleUpdateTodo: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleRemoveButton,
  loadingsIds,
  toggleTodo,
  setEditingTodoId,
  editingTodoId,
  handleEditing,
  handleUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleRemoveButton={handleRemoveButton}
          loadingsIds={loadingsIds}
          key={todo.id}
          toggleTodo={toggleTodo}
          setEditingTodoId={setEditingTodoId}
          isEditing={todo.id === editingTodoId}
          handleEditing={handleEditing}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};

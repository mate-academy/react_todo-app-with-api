import { Todo } from '../types/Todo';

import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoId: number | null;
  onDelete: (todoId: number) => void;
  onToggle: (todoId: number, completed: boolean) => void;
  updateTodo: number[];
  editingTodoId: number | null;
  handleEdit: (todoId: number) => void;
  handleUpdateTitle: (todoId: number, title: string) => void;
  handleCancelEdit: () => void;
};

export const TodoList = ({
  todos,
  deletingTodoId,
  onDelete,
  onToggle,
  updateTodo,
  editingTodoId,
  handleEdit,
  handleUpdateTitle,
  handleCancelEdit,
}: Props) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deletingTodoId={deletingTodoId}
          onDelete={onDelete}
          onToggle={onToggle}
          updateTodo={updateTodo}
          editingTodoId={editingTodoId}
          handleEdit={handleEdit}
          handleUpdateTitle={handleUpdateTitle}
          handleCancelEdit={handleCancelEdit}
        />
      ))}
    </>
  );
};

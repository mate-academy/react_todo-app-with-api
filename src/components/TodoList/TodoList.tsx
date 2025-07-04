import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  editingTodoId: number | null;
  setEditingTodoId: (id: number | null) => void;
  setErrorMessage: (message: string | null) => void;
  updateTodoTitle: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  deleteTodo,
  tempTodo,
  deletingTodoIds,
  editingTodoId,
  setEditingTodoId,
  setErrorMessage,
  updateTodoTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          loading={deletingTodoIds.includes(todo.id)}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={updateTodoTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key="temp"
          todo={tempTodo}
          toggleTodo={() => {}}
          deleteTodo={() => {}}
          loading={true}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
          setErrorMessage={setErrorMessage}
          updateTodoTitle={() => {}}
        />
      )}
    </section>
  );
};

import { Todo } from '../../types/Todo';
import { TodoItem } from '../Item/TodoItem';

type ListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
  handleToggle: (todo: Todo) => void;
  setEditTodo: (todo: Todo | null) => void;
  editTodo: Todo | null;
  handleEdit: (
    todo: Todo, editTitle: string,
    e?: React.FormEvent<HTMLFormElement>) => void;
  activeTodosId: number[];
};

export const List: React.FC<ListProps> = (
  {
    todos,
    tempTodo,
    handleDelete,
    handleToggle,
    handleEdit,
    editTodo,
    setEditTodo,
    activeTodosId,
  },
) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            editTodo={editTodo}
            setEditTodo={setEditTodo}
            activeTodosId={activeTodosId}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleDelete={handleDelete}
          handleToggle={handleToggle}
          handleEdit={handleEdit}
          editTodo={editTodo}
          setEditTodo={setEditTodo}
          activeTodosId={activeTodosId}
        />
      )}
    </section>
  );
};

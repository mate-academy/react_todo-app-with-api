import { Loader } from '../Loader/Loader';
import { Todo } from '../../types/Todo';
import '../../styles/todoapp.scss';
import '../../styles/todo.scss';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingTodosIds: number[];
  editingTodo: number | null;
  editTitle: string;
  setEditTitle: (title: string) => void;
  handleDelete: (todoId: number) => void;
  handleToggle: (todoId: number, completed: boolean) => void;
  handleEdit: (todo: Todo) => void;
  handleCancelEdit: (event: React.KeyboardEvent) => void;
  handleUpdate: (todo: Todo) => void;
};

export const TodoList = ({
  todos,
  tempTodo,
  processingTodosIds,
  editingTodo,
  editTitle,
  setEditTitle,
  handleDelete,
  handleToggle,
  handleEdit,
  handleCancelEdit,
  handleUpdate,
}: TodoListProps) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => {
        const isEditing = editingTodo === todo.id;
        const isActiveLoader = processingTodosIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={isEditing}
            isActiveLoader={isActiveLoader}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            handleDelete={handleDelete}
            handleToggle={handleToggle}
            handleEdit={handleEdit}
            handleCancelEdit={handleCancelEdit}
            handleUpdate={handleUpdate}
          />
        );
      })}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodo.completed}
              readOnly
            />
          </label>
          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <Loader isActive={true} />
        </div>
      )}
    </section>
  );
};

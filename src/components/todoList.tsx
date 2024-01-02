import { Todo } from '../types/Todo';
import { Item } from './item';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number[]) => void,
  tempTodo: Todo | null,
  todoLoadingId: number[],
  setSelectedTodo: (todo: Todo) => void,
  selectedTodo: Todo | null,
  onUpdatePost: (todo: Todo) => Promise<{ isError: boolean } | undefined>
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  todoLoadingId,
  setSelectedTodo,
  selectedTodo,
  onUpdatePost,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <Item
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        todoLoadingId={todoLoadingId}
        setSelectedTodo={setSelectedTodo}
        selectedTodo={selectedTodo}
        onUpdatePost={onUpdatePost}
      />
    ))}

    {tempTodo && (
      <div
        data-cy="Todo"
        className="todo"
      >
        {/* eslint-disable jsx-a11y/label-has-associated-control */}
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo.title}
        </span>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);

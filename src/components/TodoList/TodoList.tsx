import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[]
  title: string
  onDelete: (todoId: number) => void
  onComplete: (todo: Todo) => void
  loadingTodos: number[]
  tempTodo?: Todo | null
  updateTodo: (newTodo: Todo) => Promise<void>
}

export const TodoList: React.FC<Props> = ({
  todos, onDelete, onComplete, loadingTodos, tempTodo, updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onDelete={onDelete}
          onComplete={onComplete}
          loadingTodos={loadingTodos}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onDelete={onDelete}
          onComplete={onComplete}
          loadingTodos={loadingTodos}
          updateTodo={updateTodo}
        />
      )}
    </section>
  );
};

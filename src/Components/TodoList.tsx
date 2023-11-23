import { Todo } from '../types/Todo';
import { TemporalTodo } from './TemporalTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  togleCheck: (todo: Todo) => void;
  tempTodo: Todo | null;
  handleUpdate: (todo: Todo) => void;
  processingTodosIds: number[];
  handleDeletedTodo: (id: number) => void

};

export const TodoList: React.FC<Props> = ({
  todos,
  togleCheck,
  handleDeletedTodo,
  tempTodo,
  handleUpdate,
  processingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoItem
          handleDeletedTodo={handleDeletedTodo}
          todo={todo}
          key={todo.id}
          togleCheck={togleCheck}
          handleUpdate={handleUpdate}
          loading={processingTodosIds.includes(todo.id)}
        />
      ))}
      {tempTodo && <TemporalTodo tempTodo={tempTodo} />}
    </section>
  );
};

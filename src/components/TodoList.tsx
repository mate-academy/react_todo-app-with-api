import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  togCheck: (todo: Todo) => void;
  tempTodo: Todo | null;
  handleUpdate: (todo: Todo) => void;
  processingTodosIds: number[];
  handleDeletedTodo: (id: number) => void

};

export const TodoList: React.FC<Props> = ({
  todos,
  togCheck,
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
          togCheck={togCheck}
          handleUpdate={handleUpdate}
          loading={processingTodosIds.includes(todo.id)}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (postId: number) => Promise<unknown>;
  todosInProcess: number[];
  updateTodo: (
    todoId: number,
    newTitle: string,
    completed?: boolean,
  ) => Promise<void> | undefined;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  todosInProcess,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          todosInProcess={todosInProcess}
          updateTodo={updateTodo}
        />
      ))}
      {tempTodo && <TempTodo tempTitle={tempTodo} />}
    </section>
  );
};

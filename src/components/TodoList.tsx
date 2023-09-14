/* eslint-disable max-len */
/* eslint-disable quote-props */
import { Todo } from '../types/Todo';
import { TodoRow } from './TodoRow';

type Props = {
  todos: Todo[],
  toggleTodo: (todo: Todo) => void,
  onRenameTodo: (todoId: number, title: string) => void,
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  onRenameTodo,
  onDeleteTodo,
  deletingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoRow
          todo={todo}
          toggleTodo={toggleTodo}
          onRenameTodo={onRenameTodo}
          onDeleteTodo={onDeleteTodo}
          deletingIds={deletingIds}
        />
      ))}
    </section>
  );
};

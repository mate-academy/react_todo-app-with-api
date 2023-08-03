/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => Promise<void>;
  loadingIds: number[],
  updateTodo: (todoId: number) => Promise<void>,
  updateTodoTitle: (todoId: number) => Promise<void>,
  changeTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateTodo,
  updateTodoTitle,
  changeTodoTitle,
  newTodoTitle,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          changeTodoTitle={changeTodoTitle}
          newTodoTitle={newTodoTitle}
          loadingIds={loadingIds}
        />
      ))}
    </section>
  );
};

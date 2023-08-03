/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<any>;
  loadingId: number[];
  updateTodoTitle: (todoId: number) => Promise<any>,
  changeTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
  updateTodo: (todoId: number) => Promise<any>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  loadingId,
  updateTodoTitle,
  changeTodoTitle,
  newTodoTitle,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          loadingId={loadingId}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          changeTodoTitle={changeTodoTitle}
          newTodoTitle={newTodoTitle}
        />
      ))}
    </section>
  );
};

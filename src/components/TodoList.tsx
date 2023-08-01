/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => Promise<any>;
  isLoading: boolean,
  updateTodoTitle: (todoId: number) => Promise<any>,
  setNewTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
  updateTodo: (todoId: number) => Promise<any>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoading,
  updateTodoTitle,
  setNewTodoTitle,
  newTodoTitle,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodo={(todoId: number) => deleteTodo(todoId)}
          isLoading={isLoading}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
        />
      ))}
    </section>
  );
};

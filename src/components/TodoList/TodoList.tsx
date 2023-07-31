/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  removeTodo: (todoId: number) => Promise<any>;
  isLoading: boolean,
  updateTodo: (todoId: number) => Promise<any>,
  updateTodoTitle: (todoId: number) => Promise<any>,
  setNewTodoTitle: (newTitle: string) => void,
  newTodoTitle: string,
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  updateTodo,
  updateTodoTitle,
  setNewTodoTitle,
  newTodoTitle,
  isLoading,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          removeTodo={(todoId: number) => removeTodo(todoId)}
          updateTodo={updateTodo}
          updateTodoTitle={updateTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          newTodoTitle={newTodoTitle}
          isLoading={isLoading}
        />
      ))}
    </section>
  );
};

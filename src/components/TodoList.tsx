import { TodoData } from '../types/TodoData';
import { Todo } from './Todo';

interface TodoListProps {
  todos: TodoData[];
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (updatedTodo: TodoData) => Promise<void>;
}

export const TodoList = ({
  onTodoDelete,
  onTodoUpdate, todos,
}: TodoListProps) => {
  return (
    <>
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          isTempTodo={false}
          onTodoDelete={onTodoDelete}
          onTodoUpdate={onTodoUpdate}
        />
      ))}
    </>

  );
};

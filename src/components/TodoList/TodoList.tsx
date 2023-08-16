import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  loadingTodoIds:number[],
  updateTodo: (
    todoId:number,
    newData: Partial<Pick<Todo, 'title' | 'completed'>>) => void,
  deleteTodo:(todoId:number) => void,
  setError:(error: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  updateTodo,
  deleteTodo,
  setError,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoIds={loadingTodoIds}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          setError={setError}
        />
      ))}
    </section>
  );
};

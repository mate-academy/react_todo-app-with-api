import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[],
  handleDelete: (todoId: number) => void
  selectedTodos: number[],
  setSelectTodos: (userId: number[]) => void,
  handleUpdate: (todoId: number, data: Partial<Todo>) => void,
};

export const TodoList:React.FC<Props> = ({
  todos,
  handleDelete,
  selectedTodos,
  setSelectTodos,
  handleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          selectedTodos={selectedTodos}
          setSelectTodos={setSelectTodos}
          handleUpdate={handleUpdate}
        />
      ))}
    </section>
  );
};

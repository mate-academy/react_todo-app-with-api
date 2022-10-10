import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleDelete: (id: number)=> void;
  selectedTodo: number[];
  handleChangeStatus: (id: number, data: Partial<Todo>) => void;
  changeAllStatus: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  selectedTodo,
  handleChangeStatus,
  changeAllStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todoItem={todo}
          handleDelete={handleDelete}
          selectedTodo={selectedTodo}
          handleChangeStatus={handleChangeStatus}
          changeAllStatus={changeAllStatus}
        />
      ))}
    </section>
  );
};

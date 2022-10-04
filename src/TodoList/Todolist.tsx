import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  handleClickDelete: (id: number)=> void;
  selectedTodo: number[];
  handleChangeStatus: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleClickDelete,
  selectedTodo,
  handleChangeStatus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todoItem={todo}
          handleClickDelete={handleClickDelete}
          selectedTodo={selectedTodo}
          handleChangeStatus={handleChangeStatus}
        />
      ))}
    </section>
  );
};

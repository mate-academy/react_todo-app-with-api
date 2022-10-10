import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  selectedTodo: number[],
  handleDelete: (id: number)=> Promise<void>;
  isAdd: boolean;
  isDelete: boolean;
  isUpdateTodo: (todo: Todo, title?: string) => Promise<void>;
  isUpdate: boolean,
}

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodo,
  handleDelete,
  isAdd,
  isDelete,
  isUpdateTodo,
  isUpdate,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        selectedTodo={selectedTodo}
        todoItem={todo}
        handleDelete={handleDelete}
        isAdd={isAdd}
        isDelete={isDelete}
        isUpdateTodo={isUpdateTodo}
        isUpdate={isUpdate}
      />
    ))}
  </section>
);

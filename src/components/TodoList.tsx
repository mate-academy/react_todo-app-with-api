import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  handleToggleCompletion: (todo: Todo) => void;
  todosIdBeingEdited: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleToggleCompletion,
  todosIdBeingEdited,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleToggleCompletion={handleToggleCompletion}
          isBeingEdited={todosIdBeingEdited.includes(todo.id)}
        />
      ))}
    </section>
  );
};

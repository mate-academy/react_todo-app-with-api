import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  handleDeleteTodo: (id: number) => void;
  handleChangeCompletion: (todo: Todo, newIsCompleted: boolean) => void;
  todosIdBeingEdited: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDeleteTodo,
  handleChangeCompletion,
  todosIdBeingEdited,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          handleChangeCompletion={handleChangeCompletion}
          isBeingEdited={todosIdBeingEdited.includes(todo.id)}
        />
      ))}
    </section>
  );
};

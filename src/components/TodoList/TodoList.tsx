import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  handleDelete: (deletedPostId: number) => void;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
  handleError: (message: Errors) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  selectedTodo,
  setSelectedTodo,
  handleError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDelete={handleDelete}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          handleError={handleError}
          key={todo.id}
        />
      ))}
    </section>
  );
};

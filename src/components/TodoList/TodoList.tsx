import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (todo: Todo) => void;
  array: Todo[];
  setLoadingTodos: (todo: Todo) => void;
  edit: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  array,
  setLoadingTodos,
  edit,
}) => {
  return (
    <>
      {/* This is a completed todo */}
      {todos.map(todo => (
        <section className="todoapp__main" data-cy="TodoList" key={todo.id}>
          <TodoItem
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            loadingTodos={array}
            setLoadingTodos={setLoadingTodos}
            edit={edit}
          />
        </section>
      ))}
    </>
  );
};

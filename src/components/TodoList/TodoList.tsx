import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (todo: Todo) => void;
  array: Todo[];
  setTempArray: (todo: Todo) => void;
  edit: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updateTodo,
  deleteTodo,
  array,
  setTempArray,
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
            tempArray={array}
            setTempArray={setTempArray}
            edit={edit}
          />
        </section>
      ))}
    </>
  );
};

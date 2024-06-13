import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { TodoItem } from './TodoItem';

type Props = {
  mainTodoList: Todo[];
  updateToggle: (toggleTodo: Todo) => void;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number[];
  updateTodo: (updatedTodo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  mainTodoList,
  updateToggle,
  deleteTodo,
  tempTodo,
  loadingTodoId,
  updateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {mainTodoList.length > 0 &&
        mainTodoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateToggle={updateToggle}
            deleteTodo={deleteTodo}
            loadingTodoId={loadingTodoId}
            updateTodo={updateTodo}
          />
        ))}

      {tempTodo && <TempTodoItem todo={tempTodo} />}
    </section>
  );
};

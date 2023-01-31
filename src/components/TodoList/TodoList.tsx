import { CustomTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import TempTodo from '../TempTodo/TempTodo';
import TodoComponent from '../Todo/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  customTodo: CustomTodo | null;
  onDeleteTodo: (todoId: number) => void;
  deletingCompleted: boolean;
  onToggleStatus: (todo: Todo) => void;
  isChanging: boolean;
  isToggling: boolean;
  onTitleChange: (todo: Todo, value: string) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  customTodo,
  onDeleteTodo,
  deletingCompleted,
  onToggleStatus,
  isChanging,
  isToggling,
  onTitleChange,
}) => {
  let currentlyCanging = Filter.NONE;

  if (isToggling) {
    if (todos.some(todo => !todo.completed)) {
      currentlyCanging = Filter.ACTIVE;
    } else {
      currentlyCanging = Filter.COMPLETED;
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(
        todo => (
          <TodoComponent
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            deletingCompleted={deletingCompleted}
            onToggleStatus={() => onToggleStatus(todo)}
            isChanging={isChanging}
            currentlyChanging={currentlyCanging}
            onTitleChange={onTitleChange}
          />
        ),
      )}
      {customTodo && (
        <TempTodo
          todo={{ ...customTodo, id: 0 }}
        />
      )}
    </section>
  );
};

export default TodoList;

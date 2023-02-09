import { CustomTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import TempTodo from '../TempTodo/TempTodo';
import TodoComponent from '../Todo/Todo';
import { Filter } from '../../types/Filter';
import './TodoList.scss';

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
  let currentlyChanging = Filter.NONE;

  if (isToggling) {
    if (todos.some(todo => !todo.completed)) {
      currentlyChanging = Filter.ACTIVE;
    } else {
      currentlyChanging = Filter.COMPLETED;
    }
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(
        todo => {
          const toggleStatusHandler = () => onToggleStatus(todo);

          return (
            <li key={todo.id}>
              <TodoComponent
                todo={todo}
                onDeleteTodo={onDeleteTodo}
                deletingCompleted={deletingCompleted}
                onToggleStatus={toggleStatusHandler}
                isChanging={isChanging}
                currentlyChanging={currentlyChanging}
                onTitleChange={onTitleChange}
              />
            </li>
          );
        },
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

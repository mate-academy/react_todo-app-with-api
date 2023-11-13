import { useAppSelector } from '../../app/hook';
import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  deleteTodo(id: number): void;
  updateTodo: (id: number, completed: boolean, title: string) => void
};

enum StatusFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const TodoList: React.FC<Props> = ({
  deleteTodo, updateTodo,
}) => {
  const changeAll = useAppSelector(state => state.status.statusAllChange);
  const temporaryTodo = useAppSelector(state => state.todos.temporaryTodo);

  const statusResponse = useAppSelector(state => state.status.statusIdResponse);

  const todos = useAppSelector(state => state.todos.todos);

  const status = useAppSelector(state => state.status.statusFilter);

  function filterTodo() {
    const filterTodos: Todo[] = [...todos].filter((todo) => {
      switch (status) {
        case StatusFilter.ACTIVE:
          return !todo.completed;

        case StatusFilter.COMPLETED:
          return todo.completed;

        default:
          return todo;
      }
    });

    return filterTodos;
  }

  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      <ul>
        {filterTodo().map(todo => (
          <li
            key={todo.id}
          >
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              statusResponse={statusResponse}
              updateTodo={updateTodo}
              changeAll={changeAll}
            />
          </li>
        ))}

        {
          temporaryTodo && (
            <TodoItem
              todo={temporaryTodo}
              deleteTodo={deleteTodo}
              statusResponse={statusResponse}
              updateTodo={updateTodo}
              changeAll={changeAll}

            />
          )
        }
      </ul>
    </section>
  );
};

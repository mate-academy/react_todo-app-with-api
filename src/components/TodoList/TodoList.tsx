import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/FilterType';
import { getFilteredTodos } from '../../utils/helpers';

type Props = {
  todos: Todo[]
  activeTodos: number
  filterType: FilterType
  tempTodo: Todo | undefined,
  isWaiting: number,
  removeTodo: (id: number) => void
  isDeletingCompleted: boolean
  onUpdateTodo:
  (id: number, todo: Pick<Todo, 'title'> | Pick<Todo, 'completed'>) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  filterType,
  tempTodo,
  removeTodo,
  isWaiting,
  isDeletingCompleted,
  onUpdateTodo,
}) => {
  const visibleTodos = getFilteredTodos(todos, filterType);

  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            isWaiting={isWaiting}
            isDeletingCompleted={isDeletingCompleted}
            onUpdateTodo={onUpdateTodo}
          />
        ))}
        {tempTodo && (
          <TodoItem
            removeTodo={removeTodo}
            todo={tempTodo}
            isWaiting={isWaiting}
            isDeletingCompleted={isDeletingCompleted}
            onUpdateTodo={() => {}}
          />
        )}
      </section>
    </>
  );
};

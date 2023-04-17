import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterType } from '../../types/FilterType';

type Props = {
  togglingTodos:{}
  visibleTodos: Todo[]
  todos: Todo[]
  activeTodos: number
  filterType: FilterType
  tempTodo: Todo | null,
  removeTodo: (id: number) => void
  onUpdateTodo:
  (id: number, todo: Pick<Todo, 'title'> | Pick<Todo, 'completed'>) => void
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  removeTodo,
  onUpdateTodo,
  togglingTodos,
}) => {
  return (
    <>
      <section className="todoapp__main">
        {visibleTodos.map(todo => (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodo={removeTodo}
            onUpdateTodo={onUpdateTodo}
            togglingTodos={togglingTodos}
          />
        ))}
        {tempTodo && (
          <TodoItem
            removeTodo={removeTodo}
            togglingTodos={togglingTodos}
            todo={tempTodo}
            onUpdateTodo={() => {}}
          />
        )}
      </section>
    </>
  );
};

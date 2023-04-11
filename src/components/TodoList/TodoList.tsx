import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingIds: number[];
  onDelete: (id: number) => void;
  onUpdateTodo: (id: number, data: Partial<Todo>) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingIds,
  onDelete,
  onUpdateTodo,
}) => (
  <>
    <section className="todoapp__main">
      {todos.map(todo => {
        const isLoading = loadingIds.some(id => id === todo.id);

        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            isLoading={isLoading}
            onDelete={onDelete}
            onUpdateTodo={onUpdateTodo}
          />
        );
      })}
    </section>

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        key={tempTodo.id}
        isLoading
        onDelete={() => {}}
        onUpdateTodo={() => {}}
      />
    )}
  </>
);

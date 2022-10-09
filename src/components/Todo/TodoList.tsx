import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[];
  deleteTodo: (value: number) => void;
  isAdding: boolean;
  selectedId: number[];
  title: string;
  changeTodo: (value: number, data: Partial<Todo>) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isAdding,
  selectedId,
  title,
  changeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          isAdding={isAdding}
          selectedIds={selectedId}
          changeTodo={changeTodo}
        />
      ))}

      {isAdding && (
        <TodoInfo
          key={Math.random()}
          todo={{
            id: 0,
            userId: Math.random(),
            title,
            completed: false,
          }}
          deleteTodo={deleteTodo}
          selectedIds={selectedId}
          isAdding={isAdding}
          changeTodo={changeTodo}
        />
      )}
    </section>
  );
};

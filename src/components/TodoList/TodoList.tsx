import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  OnRemove: (param: number) => void,
  selectedId: number[],
  isAdding: boolean,
  completedTodosId: number [],
  title: string,
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoList: React.FC<Props> = ({
  todos,
  OnRemove,
  selectedId,
  isAdding,
  completedTodosId,
  handleOnChange,
  title,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          onRemove={OnRemove}
          selectedId={selectedId}
          isAdding={isAdding}
          completedTodosId={completedTodosId}
          handleOnChange={handleOnChange}
        />
      ))}

      {(isAdding && todos.length !== 0 && title) && (
        <TodoItem
          key={Math.random()}
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          todos={todos}
          onRemove={OnRemove}
          selectedId={selectedId}
          isAdding={isAdding}
          completedTodosId={completedTodosId}
          handleOnChange={handleOnChange}
        />
      )}
    </section>
  );
};

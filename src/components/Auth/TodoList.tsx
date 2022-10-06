import { Todo } from '../../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedTodoId: number[],
  isAdding: boolean,
  title: string,
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
  completedTodosId: number[],
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedTodoId,
  isAdding,
  title,
  handleOnChange,
  completedTodosId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          removeTodo={removeTodo}
          selectedIds={selectedTodoId}
          isAdding={isAdding}
          handleOnChange={handleOnChange}
          completedTodosId={completedTodosId}
        />
      ))}

      {(isAdding && todos.length > 0 && title) && (
        <TodoItem
          key={Math.random()}
          todo={{
            id: 0,
            title,
            completed: false,
            userId: Math.random(),
          }}
          todos={todos}
          removeTodo={removeTodo}
          selectedIds={selectedTodoId}
          isAdding={isAdding}
          handleOnChange={handleOnChange}
          completedTodosId={completedTodosId}
        />
      )}
    </section>
  );
};

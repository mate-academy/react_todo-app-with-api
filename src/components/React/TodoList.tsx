import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  filter: string,
  todoOnLoad: Todo | null,
  todoIdsOnLoad: number[],
  onTodoDelete: (id: number) => void,
  onTodoComplete: (id: number, completed: boolean) => void,
  saveInputChange: (id: number, title: string) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  filter,
  todoOnLoad,
  todoIdsOnLoad,
  onTodoDelete,
  onTodoComplete,
  saveInputChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos
        .filter(todo => {
          switch (filter) {
            case 'active':
              return !todo.completed;

            case 'completed':
              return todo.completed;

            default: return todo;
          }
        })
        .map(todo => {
          return (
            <TodoInfo
              todo={todo}
              key={todo.id}
              todoIdsOnLoad={todoIdsOnLoad}
              onTodoDelete={onTodoDelete}
              onTodoComplete={onTodoComplete}
              saveInputChange={saveInputChange}
            />
          );
        })}

      {todoOnLoad && (
        <TodoInfo
          todo={todoOnLoad}
          todoIdsOnLoad={todoIdsOnLoad}
          onTodoDelete={onTodoDelete}
          onTodoComplete={onTodoComplete}
          saveInputChange={saveInputChange}
        />
      )}
    </section>
  );
};

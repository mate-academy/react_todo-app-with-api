import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number) => Promise<void>,
  selTodo: Todo | null,
  onCheckedTodo: (todo: Todo) => Promise<void>,
  updateTitle: (todo: Todo) => Promise<void>,
  checkedLoading: boolean,
  checkedTRUEToogleAll: boolean,
  checkedFALSEToogleAll: boolean,
  fieldTitle: React.MutableRefObject<HTMLInputElement | null>,
};

export const Main:React.FC<Props> = ({
  todos,
  onDeleteTodo,
  selTodo,
  onCheckedTodo,
  updateTitle,
  checkedLoading,
  checkedTRUEToogleAll,
  checkedFALSEToogleAll,
  fieldTitle,
}) => {
  return (
    <section
      className="todoapp__main"
      data-cy="TodoList"
    >
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            onCheckedTodo={onCheckedTodo}
            updateTitle={updateTitle}
            checkedLoad={checkedLoading}
            checkedTRUEToogleAll={checkedTRUEToogleAll}
            checkedFALSEToogleAll={checkedFALSEToogleAll}
            fieldTitle={fieldTitle}
          />
        );
      })}
      {
        selTodo && (
          <TodoItem
            todo={selTodo}
            onDeleteTodo={onDeleteTodo}
            onCheckedTodo={onCheckedTodo}
            updateTitle={updateTitle}
            checkedLoad={checkedLoading}
            checkedTRUEToogleAll={checkedTRUEToogleAll}
            checkedFALSEToogleAll={checkedFALSEToogleAll}
            fieldTitle={fieldTitle}
          />
        )
      }
    </section>
  );
};

import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number) => Promise<void>,
  tempTodo: Todo | null,
  onCheckedTodo: (todo: Todo) => Promise<void>,
  updateTitle: (todo: Todo) => Promise<void>,
  checkedLoading: boolean,
  toggle: string,
  fieldTitle: React.MutableRefObject<HTMLInputElement | null>,
};

export const Main:React.FC<Props> = ({
  todos,
  onDeleteTodo,
  tempTodo,
  onCheckedTodo,
  updateTitle,
  checkedLoading,
  toggle,
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
            toggle={toggle}
            fieldTitle={fieldTitle}
          />
        );
      })}
      {
        tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            onCheckedTodo={onCheckedTodo}
            updateTitle={updateTitle}
            checkedLoad={checkedLoading}
            toggle={toggle}
            fieldTitle={fieldTitle}
          />
        )
      }
    </section>
  );
};

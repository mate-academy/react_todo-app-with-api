import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todosToShow: Todo[];
  tempTodo: Todo | null;
  toggledAllCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  todosToShow,
  tempTodo,
  toggledAllCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToShow.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggledAllCompleted={toggledAllCompleted}
        />
      ))}
      {tempTodo !== null && <TodoItem todo={tempTodo} />}
    </section>
  );
};

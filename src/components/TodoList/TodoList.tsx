import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todoTemp: Todo | null;
  onDelete: (id: number) => Promise<void>;
  isAdding: boolean;
  activeTodoID: number[];
  changeTodo: (todo: Todo, title: string, completed: boolean) => Promise<void>;
  showError: (message: Errors) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todoTemp,
  onDelete,
  activeTodoID,
  changeTodo,
  isAdding,
  showError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          activeTodoID={activeTodoID}
          changeTodo={changeTodo}
          isAdding={isAdding}
          showError={showError}
        />
      ))}

      {todoTemp && (
        <TodoItem
          todo={todoTemp}
          key={todoTemp.id}
          onDelete={onDelete}
          activeTodoID={activeTodoID}
          changeTodo={changeTodo}
          isAdding={isAdding}
          showError={showError}
        />
      )}
    </section>
  );
};

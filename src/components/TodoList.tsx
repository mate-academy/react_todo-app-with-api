import { Errors } from '../types/Error';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodo: Todo[];
  deleteCurrentTodo: (id: number) => void;
  deleteTodoId: number | null;
  tempTodo: Todo | null;
  editTodoTitle: (id: number, newTitle: string) => void;
  setError: (error: Errors | null) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  deleteCurrentTodo,
  deleteTodoId,
  tempTodo,
  editTodoTitle,
  setError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(({ title, completed, id }) => (
        <TodoItem
          setError={setError}
          title={title}
          completed={completed}
          key={id}
          id={id}
          loader={deleteTodoId === id}
          deleteCurrentTodo={deleteCurrentTodo}
          editTodoTitle={editTodoTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          setError={setError}
          editTodoTitle={() => {}}
          title={tempTodo.title}
          completed={tempTodo.completed}
          id={tempTodo.id}
          deleteCurrentTodo={deleteCurrentTodo}
          loader
        />
      )}
    </section>
  );
};

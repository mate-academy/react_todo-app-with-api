import { Errors } from '../types/Error';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodo: Todo[];
  deleteCurrentTodo: (id: number) => void;
  deleteTodoId: number | null;
  tempTodo: Todo | null;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
  setError: (error: Errors | null) => void;
  toggleCompleted: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  deleteCurrentTodo,
  deleteTodoId,
  tempTodo,
  updateTodoTitle,
  setError,
  toggleCompleted,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(({ title, completed, id }) => (
        <TodoItem
          toggleCompleted={toggleCompleted}
          setError={setError}
          title={title}
          completed={completed}
          key={id}
          id={id}
          loader={deleteTodoId === id}
          deleteCurrentTodo={deleteCurrentTodo}
          updateTodoTitle={updateTodoTitle}
        />
      ))}

      {tempTodo && (
        <TodoItem
          toggleCompleted={toggleCompleted}
          setError={setError}
          updateTodoTitle={updateTodoTitle}
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

/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable */
import { Todo } from '../types/Todo';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';


type Props = {
  filteredTodos: Todo[];
  deleteSingleTodo: (todoId: number) => void;
  toggleTodoCompletion: (todoId: number) => void;
  tempTodo: Todo | null;
  handleSave: (todoId: number, newTitle: string, completed: boolean) => void;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  deleteSingleTodo,
  toggleTodoCompletion,
  loadingTodoIds,
  tempTodo,
  handleSave,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          onSave={handleSave}
          toggleTodoCompletion={toggleTodoCompletion}
          loadingTodoIds={loadingTodoIds}
          deleteSingleTodo={deleteSingleTodo}
        />
      ))}

      {tempTodo && ( // Render the tempTodo if it exists
        <TempTodo todo={tempTodo} deleteSingleTodo={deleteSingleTodo} />
      )}
    </section>
  );
};

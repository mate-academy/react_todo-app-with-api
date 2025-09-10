import { Todo } from '../../types/types';
import { TodoInfo } from './TodoInfo/TodoInfo';

export type Props = {
  filteredTodos: Todo[];
  handleCheckTodo: (id: number) => void;
  handleDeleteTodos: (todoId: number) => void;
  handleEditTodo: (todoId: number, editTitle: string) => void;
  editTodoTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
  activeTodoEdit: number | null;
  setEditTodoTitle: (value: string) => void;
  setActiveTodoEdit: (todoId: number | null) => void;
  loadingTodos: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  loadingTodos,
  handleDeleteTodos,
  handleCheckTodo,
  handleEditTodo,
  editTodoTitle,
  inputRef,
  activeTodoEdit,
  setEditTodoTitle,
  setActiveTodoEdit,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((todo: Todo) => {
        return (
          <TodoInfo
            key={todo.id}
            todo={todo}
            handleCheckTodo={handleCheckTodo}
            handleDeleteTodos={handleDeleteTodos}
            activeTodoEdit={activeTodoEdit}
            editTodoTitle={editTodoTitle}
            handleEditTodo={handleEditTodo}
            inputRef={inputRef}
            setEditTodoTitle={setEditTodoTitle}
            setActiveTodoEdit={setActiveTodoEdit}
            loadingTodos={loadingTodos}
          />
        );
      })}
    </section>
  );
};

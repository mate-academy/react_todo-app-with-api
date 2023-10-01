import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodoListProps = {
  displayedTodos: () => Todo[];
  tempTodo: Todo | null;
  handleCompletedStatus: (todo: Todo) => void;
  handleDelete: (todo: Todo) => void;
  handleFormSubmitEdited: (
    editTodo: Todo,
    editTitle: string,
    event?: React.FormEvent<HTMLFormElement>,
  ) => void;
  isLoadingArr: number[];
  setEditTodo: (todo: Todo | null) => void;
  editTodo: Todo | null;
};

export const TodoList : React.FC<TodoListProps> = ({
  tempTodo,
  displayedTodos,
  handleCompletedStatus,
  handleDelete,
  handleFormSubmitEdited,
  isLoadingArr,
  setEditTodo,
  editTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {displayedTodos().map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleCompletedStatus={handleCompletedStatus}
            handleDelete={handleDelete}
            handleFormSubmitEdited={handleFormSubmitEdited}
            isLoadingArr={isLoadingArr}
            setEditTodo={setEditTodo}
            editTodo={editTodo}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
          handleDelete={handleDelete}
          handleFormSubmitEdited={handleFormSubmitEdited}
          isLoadingArr={isLoadingArr}
          setEditTodo={setEditTodo}
          editTodo={editTodo}
        />
      )}
    </section>
  );
};

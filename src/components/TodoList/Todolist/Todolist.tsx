import { Todo } from '../../../types/Todos';
import { TempTodo } from '../../TempTodo/TempTodo';
import { TodoItem } from '../../Todo/Todo';

interface Props {
  filterBy: string | null;
  filtredTodos: (filterQuery: string | null) => Todo[];
  deleteTodo: (id: number) => void;
  processingIds: number[];
  tempTodo: Todo | null;
  editedTodo: number | null;
  handleEditTodo: (id: number | null) => void;
  editedTodoTitle: string;
  setEditedTodoTitle: (value: string) => void;
  handleSubmitUpdateTodo: (todo: Todo) => void;
  isCompleted: boolean;
  setIsCompleted: (value: boolean) => void;
  handleTogleCompleted: (todo: Todo) => void;
  handleErrorMessage: (value: string) => void;
  renameCallBack: () => void;
}

export const TodoList: React.FC<Props> = ({
  filterBy,
  filtredTodos,
  deleteTodo,
  processingIds,
  tempTodo,
  editedTodo,
  handleEditTodo: handleEditTodo,
  editedTodoTitle,
  setEditedTodoTitle,
  handleSubmitUpdateTodo,
  isCompleted,
  setIsCompleted,
  handleTogleCompleted,
  handleErrorMessage,
  renameCallBack,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos(filterBy).map(todoItem => (
        <TodoItem
          key={todoItem.id}
          todo={todoItem}
          deleteTodo={deleteTodo}
          editedTodo={editedTodo}
          handleEditTodo={handleEditTodo}
          processingIds={processingIds}
          editedTodoTitle={editedTodoTitle}
          setEditedTodoTitle={setEditedTodoTitle}
          handleSubmitUpdateTodo={handleSubmitUpdateTodo}
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          handleTogleCompleted={handleTogleCompleted}
          handleErrorMessage={handleErrorMessage}
          renameCallback={renameCallBack}
        />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

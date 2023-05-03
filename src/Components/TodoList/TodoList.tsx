import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../utils/enum';

type Props = {
  setTodoList: (todos: Todo[]) => void;
  todos: Todo[];
  setErrorMessage: (errorMessage: string) => void;
  loadingTodos: number[];
  setLoadingTodos: (deletedTodos: number[]) => void;
  tempTodo: Todo | null;
  onChangeStatusTodo: (todoID: number) => void;
  onChangeNewTitle: (todoID: number, todoNewTitle: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setTodoList,
  setErrorMessage,
  loadingTodos,
  setLoadingTodos,
  tempTodo,
  onChangeStatusTodo,
  onChangeNewTitle,
}) => {
  const handleDeleteTodo = async (todoID: number) => {
    try {
      setLoadingTodos([todoID]);
      const newTodos = todos.filter((todo) => todo.id !== todoID);

      await deleteTodo(todoID);

      setTodoList(newTodos);
    } catch {
      setErrorMessage(Errors.Delete);
    } finally {
      setLoadingTodos([]);
    }
  };

  const isLoadingTempTodo = loadingTodos.includes(0);

  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const isLoadingTodo = loadingTodos.includes(todo.id);

        return (
          <TodoInfo
            isLoadingTodo={isLoadingTodo}
            todo={todo}
            onDelete={handleDeleteTodo}
            onChangeStatusTodo={onChangeStatusTodo}
            onChangeNewTitle={onChangeNewTitle}
            setErrorMessage={setErrorMessage}
            key={todo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoInfo
          isLoadingTodo={isLoadingTempTodo}
          todo={tempTodo}
          onDelete={handleDeleteTodo}
          setErrorMessage={setErrorMessage}
        />
      )}
    </section>
  );
};

import { Todo } from '../../types/Todo';
import { TodosItem } from '../TodosItem';
import { Error } from '../../types/Error';

type Props = {
  todos: Todo[] | null,
  isLoadAllDelete: boolean,
  tempTodo: Todo | null,
  setErrorsArgument: (argument: Error | null) => void,
  setTodos: (arg: Todo[]) => void,
  isLoadAllToggle: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoadAllDelete,
  tempTodo,
  setErrorsArgument,
  setTodos,
  isLoadAllToggle,
}) => {
  return (
    <ul className="todoapp__main" data-cy="TodoList">
      {(todos?.map((todo: Todo) => (
        <TodosItem
          todos={todos}
          setErrorsArgument={setErrorsArgument}
          isLoadAllDelete={isLoadAllDelete}
          key={todo.id}
          todo={todo}
          setTodos={setTodos}
          isLoadAllToggle={isLoadAllToggle}
        />
      )))}
      {tempTodo && (
        <TodosItem
          isLoadAllDelete={isLoadAllDelete}
          todo={tempTodo}
          setErrorsArgument={setErrorsArgument}
          todos={todos}
          setTodos={setTodos}
          isLoadAllToggle={isLoadAllToggle}
        />
      )}
    </ul>
  );
};

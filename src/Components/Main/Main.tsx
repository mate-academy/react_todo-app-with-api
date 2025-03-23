import { ErrorType } from '../../types/Error';
import { Todo } from '../../types/Todo';
import { SingleTodo } from './SingleTodo';
import { TemporaryTodo } from './TemporaryTodo';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  todos: Todo[] | [];
  tempTodo: Todo | null;
  setTodos: (todos: Todo[]) => void;
  handleDeletion: (todoId: number) => void;
  isLoading: number[];
  toggleCompleted: (todoId: number, data: Todo) => void;
  setIsLoading: (value: React.SetStateAction<number[]>) => void;
  setErrorType: (error: ErrorType) => void;
};

export const Main: React.FC<Props> = ({
  todos,
  tempTodo,
  setTodos,
  handleDeletion,
  isLoading,
  toggleCompleted,
  setIsLoading,
  setErrorType,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <SingleTodo
            setErrorType={setErrorType}
            setIsLoading={setIsLoading}
            toggleCompleted={toggleCompleted}
            isLoading={isLoading.includes(todo.id)}
            handleDeletion={handleDeletion}
            setTodos={setTodos}
            key={todo.id}
            todo={todo}
            todos={todos}
          />
        );
      })}
      {tempTodo !== null && <TemporaryTodo isLoading tempTodo={tempTodo} />}
    </section>
  );
};

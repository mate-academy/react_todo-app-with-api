import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  removeTodoFromTodos: (v: number) => void;
  changeCompletedTodoById: (v: number) => void;
  setErrorMessage: (v: string) => void;
  changeTodoTitleById: (v: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodoFromTodos,
  changeCompletedTodoById,
  setErrorMessage,
  changeTodoTitleById,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            removeTodoFromTodos={removeTodoFromTodos}
            changeCompletedTodoById={changeCompletedTodoById}
            setErrorMessage={setErrorMessage}
            changeTodoTitleById={changeTodoTitleById}
          />
        );
      })}
    </section>
  );
};

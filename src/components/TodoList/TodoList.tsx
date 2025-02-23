import { TodoInfo } from '../TodoInfo/TodoInfo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;

  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoList: React.FC<Props> = ({ todos, tempTodo, inputRef }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo todo={todo} key={todo.id} inputRef={inputRef} />
      ))}

      {tempTodo && (
        <TodoInfo todo={tempTodo} isTemp={true} inputRef={inputRef} />
      )}
    </section>
  );
};

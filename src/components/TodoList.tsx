import { Todo } from '../types/Todo';
import { TodoItems } from './TodoItems';
import { ErrorMessage } from './errorsMessage';

type Props = {
  posts: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  todoTemplate: Todo | null;
  error: ErrorMessage | '';
};

export const TodoList: React.FC<Props> = ({
  posts,
  todoTemplate,
  setTodos,
  error,
  setErrorMessage,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {posts.map(post => (
        <TodoItems
          key={post.id}
          todoTemplate={todoTemplate}
          post={post}
          error={error}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
        />
      ))}
    </section>
  );
};

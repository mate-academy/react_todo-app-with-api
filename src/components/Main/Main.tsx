import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/type';
import { TodoItem } from '../TodoItem/index';

type Props = {
  posts: Todo[];
  setPosts: React.Dispatch<React.SetStateAction<Todo[]>>;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  resetError: () => void;
};

export const Main: React.FC<Props> = ({
  posts, setPosts, setError, resetError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {posts.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          posts={posts}
          setPosts={setPosts}
          setError={setError}
          resetError={resetError}
        />
      ))}
    </section>
  );
};

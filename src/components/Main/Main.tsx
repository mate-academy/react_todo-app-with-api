import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loader: boolean;
  tempTodo: Todo | null;
  deletePosts: (todo: Todo) => void;
  addActivePosts: (todo: Todo) => void;
  loadTodos: number[];
  changeInputs: (todo: Todo, value: string) => void;
  clickTodo: number | null;
  setChangeInput: (value: string) => void;
  changeInput: string;
  setClickTodo: (id: number) => void;
}

export const Main = ({
  todos,
  loader,
  tempTodo,
  deletePosts,
  addActivePosts,
  loadTodos,
  changeInputs,
  clickTodo,
  setChangeInput,
  changeInput,
  setClickTodo,
}: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.length > 0 &&
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            loader={loader && loadTodos.includes(todo.id)}
            deletePosts={deletePosts}
            addActivePosts={addActivePosts}
            changeInputs={changeInputs}
            clickTodo={clickTodo}
            setChangeInput={setChangeInput}
            changeInput={changeInput}
            setClickTodo={setClickTodo}
          />
        ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          loader={loader}
          deletePosts={() => {}}
          addActivePosts={() => {}}
          changeInputs={() => {}}
          clickTodo={null}
          setChangeInput={() => {}}
          changeInput=""
          setClickTodo={() => {}}
        />
      )}
    </section>
  );
};

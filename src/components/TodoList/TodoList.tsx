import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { AppContext } from '../../AppContext';

interface Props {
  todosToView: Todo[];
  deleteTodo: (todoToDelete: Todo) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
}

export const TodoList = ({
  todosToView,
  deleteTodo,
  updateTodo,
}: Props) => {
  const { state } = useContext(AppContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todosToView.map(todo => (
        <TodoItem
          todo={todo}
          removeTodo={deleteTodo}
          key={todo.id}
          updateTodo={updateTodo}
        />
      ))}
      {state.tempTodo
        && (
          <TodoItem
            todo={state.tempTodo}
            removeTodo={deleteTodo}
            isLoading
            updateTodo={updateTodo}
          />
        )}
    </section>
  );
};

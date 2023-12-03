import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../../TodosContext';

interface Props {
  removeTodo: (todo: Todo) => void;
}

export const TodoList: React.FC<Props> = ({ removeTodo }) => {
  const context = useContext(TodosContext);

  const { filteredTodos } = context;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          removeTodo={removeTodo}
          isTempTodo={false}
        />
      ))}
    </section>
  );
};

import { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { GlobalContext } from '../TodoContext';
import { filterTodos } from '../utils/filterTodos';

export const TodoList = () => {
  const { state, tempTodo } = useContext(GlobalContext);

  const filteredTodos = filterTodos(state.todos, state.filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      {tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};

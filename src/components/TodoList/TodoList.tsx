import { TodoItem } from '../Todo/TodoItem';
import { useTodosContext } from '../../utils/useTodosContext';
import { handleFilteredTodos } from '../../utils/handleFiltredTodos';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const TodoList: React.FC = () => {
  const { todos, filterSelected, tempTodo, onDelete, setIsFocused } =
    useTodosContext();
  const preparedTodos = handleFilteredTodos(todos, filterSelected);

  const deleteTodo = (todoId: number) => {
    onDelete(todoId);
    setIsFocused(true);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {preparedTodos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem todo={todo} deleteTodo={deleteTodo} />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} deleteTodo={deleteTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

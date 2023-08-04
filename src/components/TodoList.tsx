import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTodoContext } from '../hooks/useTodoContext';
import TodoItem from './TodoItem';

const TodoList = () => {
  const {
    todos,
    tempTodo,
    processed,
  } = useTodoContext();

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            className="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onProcessed={processed.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo
          && (
            <CSSTransition
              key={tempTodo.id}
              classNames="temp-item"
              timeout={300}
            >
              <TodoItem todo={tempTodo} onProcessed />
            </CSSTransition>
          )}
      </TransitionGroup>
    </section>
  );
};

export default TodoList;

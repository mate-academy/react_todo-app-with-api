import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from './TodoItem';
import '../../../styles/transitiongroup.scss';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
  isAdding: boolean,
  title: string,
  todoStatus: boolean,
  handleOnChange: (updateId: Todo) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
  isAdding,
  title,
  todoStatus,
  handleOnChange,

}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              todoStatus={todoStatus}
              handleOnChange={handleOnChange}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={Math.random()}
              todo={{
                id: 0,
                title,
                completed: false,
                userId: Math.random(),
              }}
              removeTodo={removeTodo}
              selectedId={selectedId}
              isAdding={isAdding}
              todoStatus={todoStatus}
              handleOnChange={handleOnChange}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from './TodoItem';
import '../../../styles/transitiongroup.scss';

interface Props {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedIds: number[],
  isAdding: boolean,
  title: string,
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>,
}

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedIds,
  isAdding,
  title,
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
              todos={todos}
              removeTodo={removeTodo}
              selectedIds={selectedIds}
              isAdding={isAdding}
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
              todos={todos}
              removeTodo={removeTodo}
              selectedIds={selectedIds}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

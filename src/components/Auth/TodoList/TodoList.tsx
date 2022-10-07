import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../../types/Todo';
import { TodoItem } from './TodoItem';
import '../../../styles/transitiongroup.scss';

interface Props {
  todos: Todo[];
  selectedIds: number[];
  isAdding: boolean;
  title: string;
  errorMessage: string | null;
  handleOnChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  selectedIds,
  isAdding,
  title,
  errorMessage,
  handleOnChange,
  setErrorMessage,
  setSelectedIds,
  setTodos,
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
              selectedIds={selectedIds}
              errorMessage={errorMessage}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
              setErrorMessage={setErrorMessage}
              setSelectedIds={setSelectedIds}
              setTodos={setTodos}
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
              selectedIds={selectedIds}
              errorMessage={errorMessage}
              isAdding={isAdding}
              handleOnChange={handleOnChange}
              setErrorMessage={setErrorMessage}
              setSelectedIds={setSelectedIds}
              setTodos={setTodos}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

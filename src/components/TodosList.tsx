import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[]
  deleteTodo: (userId: number) => void,
  tempTodo: Todo | null,
  isLoading: boolean,
  selectedTodoId: number[],
  toggleTodoStatus: (todoId: number, completed: boolean) => void,
  setNewTitle: (todoId: number, title: string) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  isLoading,
  selectedTodoId,
  toggleTodoStatus,
  setNewTitle,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <div
              key={todo.id}
              className={classNames('todo', { completed: todo.completed })}
            >
              <TodoInfo
                todo={todo}
                deleteTodo={deleteTodo}
                setNewTitle={setNewTitle}
                isLoading={isLoading && (
                  selectedTodoId.includes(todo.id)
                )}
                toggleTodoStatus={toggleTodoStatus}
              />
            </div>
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TempTodo tempTodo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import '../../styles/transitionGroup.scss';

type Props = {
  todos: Todo[],
  onDelete: (todo: number) => void
  isAdding: boolean
  isLoading: boolean
  newTodoTitle: string
  handleUpdateTodo: (todo: Todo) => void
  selectedTodoId: number
  setSelectedTodoId: (id: number) => void
  selectedTodos: number[];
  setSelectedTodos: (todoId: number[]) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  isAdding,
  newTodoTitle,
  handleUpdateTodo,
  selectedTodoId,
  setSelectedTodoId,
  selectedTodos,
  setSelectedTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              title={todo.title}
              onDelete={onDelete}
              todo={todo}
              handleUpdateTodo={handleUpdateTodo}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              title={newTodoTitle}
              key={0}
              onDelete={onDelete}
              handleUpdateTodo={handleUpdateTodo}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              selectedTodos={selectedTodos}
              setSelectedTodos={setSelectedTodos}
              todo={{
                title: newTodoTitle,
                completed: false,
                id: 0,
                userId: 0,
              }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

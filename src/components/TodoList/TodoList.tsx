import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import './TodoList.scss';

type Props = {
  todos: Todo[] | null,
  userId: number,
  title: string,
  isAdding: boolean,
  selectedTodoId: number | null,
  isLoader: boolean,
  isLoaderCompletedTodo: boolean,
  isLoaderUnCompletedTodo: boolean,
  completedTodosIds: number[],
  unCompletedTodosIds: number[],
  isDoubleClick: boolean,
  handlerTodoDoubleClick: (id: number, titleValue: string) => void,
  handlerTodoDeleteButton: (id: number) => void,
  handlerChangeTodoStatus: (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    completed: boolean,
    getChandedStatus: (value: boolean) => void,
  ) => void,
  changedTodoTitle: string,
  setChangedTodoTitle: (value: string) => void,
  setIsDoubleClick: (value: boolean) => void,
  handlerSubmitNewTodoTitleField: (oldTodotitle: string, id: number) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  userId,
  title,
  isAdding,
  isLoader,
  selectedTodoId,
  isLoaderCompletedTodo,
  isLoaderUnCompletedTodo,
  isDoubleClick,
  handlerTodoDoubleClick,
  completedTodosIds,
  unCompletedTodosIds,
  handlerTodoDeleteButton,
  handlerChangeTodoStatus,
  changedTodoTitle,
  setChangedTodoTitle,
  setIsDoubleClick,
  handlerSubmitNewTodoTitleField,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos?.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isAdding={isAdding}
              isLoader={isLoader}
              selectedTodoId={selectedTodoId}
              isLoaderCompletedTodo={isLoaderCompletedTodo}
              isLoaderUnCompletedTodo={isLoaderUnCompletedTodo}
              completedTodosIds={completedTodosIds}
              unCompletedTodosIds={unCompletedTodosIds}
              handlerTodoDeleteButton={handlerTodoDeleteButton}
              handlerChangeTodoStatus={handlerChangeTodoStatus}
              isDoubleClick={isDoubleClick}
              handlerTodoDoubleClick={handlerTodoDoubleClick}
              changedTodoTitle={changedTodoTitle}
              setChangedTodoTitle={setChangedTodoTitle}
              setIsDoubleClick={setIsDoubleClick}
              handlerSubmitNewTodoTitleField={handlerSubmitNewTodoTitleField}
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
              todo={{
                id: 0,
                userId,
                completed: false,
                title,
              }}
              isAdding={isAdding}
              isLoader={isLoader}
              selectedTodoId={selectedTodoId}
              isLoaderCompletedTodo={isLoaderCompletedTodo}
              isLoaderUnCompletedTodo={isLoaderUnCompletedTodo}
              completedTodosIds={completedTodosIds}
              unCompletedTodosIds={unCompletedTodosIds}
              handlerTodoDeleteButton={handlerTodoDeleteButton}
              handlerChangeTodoStatus={handlerChangeTodoStatus}
              isDoubleClick={isDoubleClick}
              handlerTodoDoubleClick={handlerTodoDoubleClick}
              changedTodoTitle={changedTodoTitle}
              setChangedTodoTitle={setChangedTodoTitle}
              setIsDoubleClick={setIsDoubleClick}
              handlerSubmitNewTodoTitleField={handlerSubmitNewTodoTitleField}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};

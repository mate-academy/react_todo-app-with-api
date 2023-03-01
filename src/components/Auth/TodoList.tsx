import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  filteredList: Todo[] | undefined;
  removeTodo: (todoId: number | undefined) => void;
  updateTODOCompleted: (todoNew: Todo) => void;
  updateTODOTitle: (todoId: number | undefined, title: string) => void;
  isLoadingNewName: boolean;
};

export const TodoList: React.FC<Props> = ({
  filteredList,
  removeTodo,
  updateTODOCompleted,
  updateTODOTitle,
  isLoadingNewName,
}) => {
  return (
    <ul>
      {filteredList
        && filteredList.map((todo) => (
          <section className="todoapp__main" data-cy="TodoList">
            <li key={todo.id}>
              <TodoInfo
                todo={todo}
                updateTODOCompleted={updateTODOCompleted}
                removeTodo={removeTodo}
                updateTODOTitle={updateTODOTitle}
                isLoadingNewName={isLoadingNewName}
              />
            </li>
            {' '}
          </section>
        ))}
    </ul>
  );
};

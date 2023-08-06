import React, { } from 'react';
import { ListItem } from './ListItem';
import { Todo } from '../types/Todo';

type Props = {
  setOfItems: Todo[],
  deleteItem: (todoId: number) => void,
  tempTodo: Todo | null,
  setMessageError: React.Dispatch<React.SetStateAction<string>>,
  isProcessing: boolean,
  handleUpdate: (todoToUpdate: Todo, title?: string) => void,
};

export const TodosList: React.FC<Props> = ({
  setOfItems,
  deleteItem,
  tempTodo,
  setMessageError,
  isProcessing,
  handleUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {setOfItems.map(todo => (
        <ListItem
          key={todo.id}
          todo={todo}
          deleteItem={deleteItem}
          setMessageError={setMessageError}
          // setError={setError}
          handleUpdate={handleUpdate}
          isFetching={todo.isFetching}
        />
      ))}

      {tempTodo && isProcessing && (
        <ListItem
          todo={tempTodo}
          deleteItem={deleteItem}
          setMessageError={setMessageError}
          // setError={setError}
          handleUpdate={handleUpdate}
        />
      )}
    </section>
  );
};

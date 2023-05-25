/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  memo,
  useContext,
} from 'react';

import { Title } from './Components/Title/Title';
import { Header } from './Components/Header/Header';
import { Footer } from './Components/Footer/Footer';
import { Error } from './Components/Error/Error';
import { TodoContext } from './TodoContext/TodoContext';
import { TodoList } from './Components/TodoList';

export const App: FC = memo(() => {
  const {
    isTodosNoEmpty,
  } = useContext(TodoContext);

  return (
    <div className="todoapp">
      <Title />

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {isTodosNoEmpty && (
          <Footer />
        )}

        <Error />
      </div>
    </div>
  );
});

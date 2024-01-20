import { Footer } from '../Footer';
import { Header } from '../Header';
import { Notification } from '../Notification';
import { TodoList } from '../TodoList';

export const TodoApp = () => {
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        <Footer />
      </div>

      <Notification />
    </div>
  );
};

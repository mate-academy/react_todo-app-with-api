import { useState } from 'react';

const Item = function ({ item }: any) {
  const [t, setT] = useState(item.checked);

  return (
    <input
      type="checkbox"
      checked={t}
      onChange={() => setT(!t)}
    />
  );
};

export function App() {
  const [data] = useState([{ id: 1, checked: true }]);

  return data.map(item => (
    <Item
      key={item.id}
      item={item}
    />
  ));
}

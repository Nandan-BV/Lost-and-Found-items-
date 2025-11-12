import React from 'react';

export interface Item {
  id: number;
  name: string;
  description: string;
  is_lost: boolean;
}

interface ItemListProps {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const ItemList: React.FC<ItemListProps> = ({ items, loading, error }) => {
  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Items</h2>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item.id} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <span className={`font-bold ${item.is_lost ? 'text-red-500' : 'text-green-500'}`}>
                {item.is_lost ? 'Lost' : 'Found'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;

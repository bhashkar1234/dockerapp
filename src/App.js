import React, { useState, useEffect } from 'react';

function App() {
  const [pantryId, setPantryId] = useState('');
  const [basketKey, setBasketKey] = useState('');
  const [payload, setPayload] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [pantryItems, setPantryItems] = useState([]);
  const [selectedPantryItem, setSelectedPantryItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch and list pantry items when the pantryId changes
    if (pantryId) {
      let url = `/api/list-baskets/${pantryId}`;
      if (nameFilter) {
        url += `?name=${nameFilter}`;
      }

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setPantryItems(data);
        })
        .catch((error) => setError(error));
    }
  }, [pantryId, nameFilter]);

  // Function to handle creating a pantry item
  const createPantryItem = () => {
    fetch('/api/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pantryId, basketKey, payload }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPantryItems([...pantryItems, basketKey]);
        setBasketKey('');
        setPayload('');
      })
      .catch((error) => setError(error));
  };

  // Function to select a pantry item for update
  const selectPantryItem = (basketKey) => {
    setSelectedPantryItem(basketKey);
  };

  // Function to update a selected pantry item
  const updatePantryItem = () => {
    if (selectedPantryItem) {
      fetch(`/api/update-item/${pantryId}/${selectedPantryItem}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload }),
      })
        .then((res) => res.json())
        .then((data) => {
          const updatedPantryItems = pantryItems.map((item) =>
            item === selectedPantryItem ? data : item
          );
          setPantryItems(updatedPantryItems);
          setSelectedPantryItem(null);
          setPayload('');
        })
        .catch((error) => setError(error));
    }
  };

  // Function to delete a pantry item
  const deletePantryItem = (basketKey) => {
    fetch(`/api/delete-item/${pantryId}/${basketKey}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedPantryItems = pantryItems.filter(
          (item) => item !== basketKey
        );
        setPantryItems(updatedPantryItems);
      })
      .catch((error) => setError(error));
  };

  return (
    <div className="App">
      <h1>Pantry API App</h1>
      <div>
        <label>Pantry ID:</label>
        <input
          type="text"
          value={pantryId}
          onChange={(e) => setPantryId(e.target.value)}
        />
      </div>
      <div>
        <label>Basket Key:</label>
        <input
          type="text"
          value={basketKey}
          onChange={(e) => setBasketKey(e.target.value)}
        />
        <label>Value:</label>
        <input
          type="text"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
        />
        <button onClick={createPantryItem}>Add Item</button>
      </div>
      <div>
        <label>Filter by Name:</label>
        <input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>
      <ul>
        {pantryItems.map((item) => (
          <li key={item}>
            {item}{' '}
            <button onClick={() => selectPantryItem(item)}>Edit</button>{' '}
            <button onClick={() => deletePantryItem(item)}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedPantryItem && (
        <div>
          <h2>Edit Item: {selectedPantryItem}</h2>
          <input
            type="text"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
          />
          <button onClick={updatePantryItem}>Update</button>
        </div>
      )}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}

export default App;

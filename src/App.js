import React, { useState, useEffect } from 'react'
import List from './components/List'
import Alert from './components/Alert'

const handleGetLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('');
  const [list, setList] = useState(handleGetLocalStorage());
  const [isEditing, setIsEditing] = useState(null);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({show: false, msg: 't', type: ''});

  const showAlert = (show=false, type='', msg='') => {
    setAlert({show, type, msg})
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(!name) {
      showAlert(true, 'danger', 'Please enter some value')
    } else if(name && isEditing) {
      setList(list.map((item) => {
        if(item.id === editID) {
          return {...item, title: name}
        }
        return item
      }))
      setName('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'Item added to the list')
      const newItem = {id: new Date().getTime().toString(),
         title: name};
         setList([...list, newItem]);
         setName('');
    }
  }

  const handleClearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  }

  const handleRemoveItem = id => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id))
  }

  const handleEditItem = id => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  }, [list])

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className='form-control'>
          <input 
          type='text'
          className='grocery'
          placeholder='e.g: Milk'
          value={name}
          onChange={(e) => setName(e.target.value)} />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} handleRemoveItem={handleRemoveItem}   handleEditItem={handleEditItem} />
          <button className='clear-btn' onClick={handleClearList}>clear items</button>
        </div>
      )}
    </section>
  )
}

export default App

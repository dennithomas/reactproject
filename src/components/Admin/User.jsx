import React, { useEffect, useState } from 'react'
import "./../../Users.css"

const User = () => {
  const [data, setData] = useState([]);

  let x = fetch("http://localhost:4000/users");

  useEffect(() => {
    let y = x.then((a) => a.json());
    y.then((b) => {
      setData(b);
    });
  }, []);

  let isEmpty = data.length === 0;

  function remove(id) {
    fetch(`http://localhost:4000/users/${id}`, { method: "DELETE" })
      .then(() => {
        setData(prev => prev.filter(item => item.id !== id));
      });
  }

  return (
    <div className="user-page">
      {isEmpty ? (
        <h1 className="user-empty-text">users list is empty</h1>
      ) : (
        <div className="user-wrapper">

          <div className="user-count-box">
            <h1>Total Users: {data.length}</h1>
          </div>

          <h1 className="user-heading">Users</h1>

          {data.map((ele) => (
            <div className="user-card" key={ele.id}>
              <h4 className="user-info">ID: {ele.id}</h4>
              <h4 className="user-info">First Name: {ele.firstName}</h4>
              <h4 className="user-info">Last Name: {ele.lastName}</h4>
              <h4 className="user-info">Email: {ele.email}</h4>
              <h4 className="user-info">
                Phone: {ele.phone ? ele.phone : "not available"}
              </h4>
              <h4 className="user-info">
                Address: {ele.address ? ele.address : "not available"}
              </h4>
            

              <div className="user-action">
                <button onClick={() => remove(ele.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default User

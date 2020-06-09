/************************************************
 * submitData:
 * Receives data and a handle to then Post (insert)
 * into database.
 * Returns the newData to repopulate table with.
************************************************/
export async function submitData(data, handle){
    return fetch(handle, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(newData => {
        return newData;
      });
};
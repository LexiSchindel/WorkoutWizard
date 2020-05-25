/************************************************
 * deleteData:
 * Receives id to delete and a handle to then
 * delete from database.
 * Returns the newData to repopulate table with.
************************************************/
export async function deleteData(data, handle){

    //create url using handle and appending id
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
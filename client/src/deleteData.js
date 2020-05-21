/************************************************
 * deleteData:
 * Receives id to delete and a handle to then
 * delete from database.
 * Returns the newData to repopulate table with.
************************************************/
export async function deleteData(id, handle){

    //create url using handle and appending id
    return fetch(handle + '/' + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
      .then(response => response.json())
      .then(newData => {
        return newData;
      });
};
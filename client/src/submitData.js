export async function submitData(data, handle){

    //
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
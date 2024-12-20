export function downloadJson(json: any, name = 'data') {
  const blob = new Blob([JSON.stringify(json, null, 4)], {
    type: 'application/json',
  }); //Create a blob from your data
  const url = window.URL.createObjectURL(blob); // create a url for that blob
  const link = document.createElement('a'); // create a link element
  link.href = url; // set the href of the link to the url
  link.download = name + '.json'; // set the download attribute with the filename
  link.click(); // click the link programmatically to start the download
}

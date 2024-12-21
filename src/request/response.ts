import browser from "webextension-polyfill";

const getResponseBody = (id: any) => {
  let decoder = new TextDecoder('utf-8');

  return new Promise((resolve, reject) => {
    let data: any = [];
    let filter = browser.webRequest.filterResponseData(id);
    filter.ondata = (event) => {
      data.push(event.data);
      filter.write(event.data);
    };

    filter.onerror = (event) => {
      reject(new Error('Error in filter')); // Reject the promise if there's an error
    };

    filter.onstop = (event) => {
      let str = '';
      if (data.length === 1) {
        str = decoder.decode(data[0]);
      } else {
        for (let i = 0; i < data.length; i++) {
          const stream = i !== data.length - 1;
          str += decoder.decode(data[i], { stream });
        }
      }
      resolve(str);

      filter.close();
    };
  });
};

export default getResponseBody;

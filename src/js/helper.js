// Import necessary constants and the async module
import { TIMEOUT_SEC } from './config.js';
import { async } from 'regenerator-runtime';

// Define a function to create a timeout promise
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Define the AJAX function for making GET and POST requests
export const AJAX = async function (url, uploadData = undefined) {
  try {
    // Create a fetch promise based on whether uploadData is provided
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Use Promise.race to wait for either the fetch or timeout promise to resolve
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // Parse the response body as JSON
    const data = await res.json();

    // Check if the response is successful (status code 200-299), otherwise throw an error
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Return the parsed JSON data
    return data;
  } catch (err) {
    throw err; // Rethrow any errors that occurred during the request or parsing
  }
};

// export const getJSON = async url => {
//   try {
//     //  const res = await fetch(url);

//     const fetchPro = fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} : ${res.status}`);
//     // console.log(data);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async (url, uploadData) => {
//   try {
//     //  const res = await fetch(url);

//     const sendPro = fetch(url, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(uploadData),
//     });
//     const res = await Promise.race([sendPro, timeout(TIMEOUT_SEC)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} : ${res.status}`);
//     // console.log(data);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

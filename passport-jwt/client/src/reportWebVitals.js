// // Import the 'reportWebVitals' function from 'web-vitals'
// import { reportWebVitals } from 'web-vitals';

// // You don't need to redeclare it; just call it if needed in your app
// const logWebVitals = onPerfEntry => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     reportWebVitals(onPerfEntry);
//   }
// };

// export default logWebVitals;


import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals';

// Function to log web vitals
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Call individual web vitals functions
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onFID(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;

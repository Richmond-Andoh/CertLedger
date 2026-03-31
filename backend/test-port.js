require('dotenv').config();
console.log('PORT from process.env:', process.env.PORT);
console.log('PORT fallback:', process.env.PORT || 5000);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS);

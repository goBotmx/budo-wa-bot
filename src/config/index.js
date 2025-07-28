require('dotenv').config();

module.exports = {
  verifyToken: process.env.VERIFY_TOKEN,
  accessToken: process.env.ACCESS_TOKEN,
  phoneId: process.env.PHONE_ID,
  graphApiUrl: process.env.GRAPH_API_URL,
  port: process.env.PORT,
  
  P4VIT_API_BASE_URL: process.env.P4VIT_API_BASE_URL,
  P4VIT_ENTERPRISE_ID: process.env.P4VIT_ENTERPRISE_ID
};
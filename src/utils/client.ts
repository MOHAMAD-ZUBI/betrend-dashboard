import axios from "axios";

// Set baseURL based on environment
const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL // Production API URL
    : process.env.NEXT_PUBLIC_DEVELOPEMENT_API_URL; // Development API URL

const client = axios.create({
  baseURL: baseURL,
});

export default client;

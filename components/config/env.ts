export const ENV = {
  API_BASE_URL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`,
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
};

console.log("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);
console.log("API_BASE_URL", ENV.API_BASE_URL);

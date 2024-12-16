import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_PORT = process.env.NEXT_PUBLIC_API_BASE_PORT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Extract dynamic path after /api/proxy
    const { path } = req.query;

    // Construct the target backend URL
    const backendURL = `${API_BASE_URL}:${API_PORT}/api/${
      Array.isArray(path) ? path.join('/') : path
    }`;

    // Debugging the constructed URL
    console.log('Proxying request to:', backendURL);

    // Forward the request using Axios
    const response = await axios({
      method: req.method, // Forward the original HTTP method
      url: backendURL,
      headers: {
        ...req.headers,
        host: undefined, // Remove the 'host' header to prevent conflicts
      },
      data: req.body, // Forward the request body
    });

    // Return the backend's response to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Proxy request failed',
      error: error.message,
    });
  }
}

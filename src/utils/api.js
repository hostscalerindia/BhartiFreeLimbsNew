const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Global loading state management
let loadingCount = 0;
const loadingListeners = new Set();

export const addLoadingListener = (listener) => {
  loadingListeners.add(listener);
  return () => loadingListeners.delete(listener);
};

const setLoading = (isLoading) => {
  loadingListeners.forEach(listener => listener(isLoading));
};

const startLoading = () => {
  loadingCount++;
  if (loadingCount === 1) {
    setLoading(true);
  }
};

const stopLoading = () => {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount === 0) {
    setLoading(false);
  }
};

export async function apiRequest(endpoint, method = 'GET', body = null, isFormData = false) {
  const config = {
    method,
    headers: {},
  };

  if (body) {
    if (isFormData) {
      // For FormData (file uploads), don't set Content-Type header
      // Let the browser set it automatically with boundary
      config.body = body;
    } else {
      // For JSON data
      config.headers['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    }
  } else {
    config.headers['Content-Type'] = 'application/json';
  }

  startLoading();
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  } catch (err) {
    console.error('API Error:', err.message);
    throw err;
  } finally {
    stopLoading();
  }
}

export const post = (url, body, isFormData = false) => {
  // Auto-detect FormData
  if (body instanceof FormData) {
    isFormData = true;
  }
  return apiRequest(url, 'POST', body, isFormData);
};
export const get = (url) => apiRequest(url, 'GET');
export const put = (url, body, isFormData = false) => apiRequest(url, 'PUT', body, isFormData);
export const del = (url) => apiRequest(url, 'DELETE');

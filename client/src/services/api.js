// When deployed on Netlify, /api/* is proxied to Render via netlify.toml redirects.
// When running locally, Vite proxies /api to localhost:5000 via vite.config.js.
// VITE_API_URL env var is also supported as a fallback override.
const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
  : '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('taj_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  async getProduct(slugOrId) {
    const res = await fetch(`${API_BASE}/products/${slugOrId}`);
    return res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async createCategory(data) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateCategory(id, data) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  async updateSettings(data) {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Testimonials
  async getTestimonials() {
    const res = await fetch(`${API_BASE}/testimonials`);
    return res.json();
  },

  async getAdminTestimonials() {
    const res = await fetch(`${API_BASE}/testimonials/admin`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createTestimonial(data) {
    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateTestimonial(id, data) {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteTestimonial(id) {
    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Content Blocks
  async getContent(page) {
    const res = await fetch(`${API_BASE}/content/blocks/${page}`);
    return res.json();
  },

  async updateContentBlock(page, section_key, data) {
    const res = await fetch(`${API_BASE}/content/blocks/${page}/${section_key}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // FAQs
  async getFaqs() {
    const res = await fetch(`${API_BASE}/content/faqs`);
    return res.json();
  },

  async getAdminFaqs() {
    const res = await fetch(`${API_BASE}/content/faqs/admin`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async createFaq(data) {
    const res = await fetch(`${API_BASE}/content/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateFaq(id, data) {
    const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteFaq(id) {
    const res = await fetch(`${API_BASE}/content/faqs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Contact
  async sendContactMessage(data) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getContactInquiries() {
    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Image Upload
  async uploadImage(file) {
    const token = localStorage.getItem('taj_admin_token');
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    return res.json();
  },

  // Admin Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async verifyAuth() {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return res.json();
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};

const API_BASE_URL = 'http://localhost:8082/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = text;
  }
  
  if (!response.ok) {
    throw new Error(text);
  }
  return data;
};

// Get auth headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Auth API functions
export const authApi = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

// Users API functions
export const usersApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  create: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  changePassword: async (id, currentPassword, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword })
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
};

// Formations API functions
export const formationsApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching formations:', error);
      throw error;
    }
  },

  getMonthlyStats: async (month, year) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats/monthly?month=${month}&year=${year}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching monthly formation stats:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching formation ${id}:`, error);
      throw error;
    }
  },

  create: async (formationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formationData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating formation:', error);
      throw error;
    }
  },

  update: async (id, formationData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formationData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating formation ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting formation ${id}:`, error);
      throw error;
    }
  },

  getParticipants: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/${id}/participants`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching participants for formation ${id}:`, error);
      throw error;
    }
  },

  addParticipant: async (formationId, participantId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/formations/${formationId}/participants/${participantId}`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error adding participant to formation:', error);
      throw error;
    }
  },

  removeParticipant: async (formationId, participantId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/formations/${formationId}/participants/${participantId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error removing participant from formation:', error);
      throw error;
    }
  }
};

// Participants API functions
export const participantsApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/participants`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching participant ${id}:`, error);
      throw error;
    }
  },

  getByProfile: async (profile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/profile/${profile}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching participants with profile ${profile}:`, error);
      throw error;
    }
  },

  getCountByProfile: async (profile) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/profile/${profile}/count`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching participant count with profile ${profile}:`, error);
      throw error;
    }
  },

  getParticipantsWithProfileParticipant: async () => {
    return participantsApi.getByProfile('Participant');
  },

  getParticipantCountWithProfileParticipant: async () => {
    return participantsApi.getCountByProfile('Participant');
  },

  getParticipantsWithProfileIntern: async () => {
    return participantsApi.getByProfile('Intern');
  },

  getParticipantCountWithProfileIntern: async () => {
    return participantsApi.getCountByProfile('Intern');
  },

  getParticipantsWithProfileExtern: async () => {
    return participantsApi.getByProfile('Extern');
  },

  getParticipantCountWithProfileExtern: async () => {
    return participantsApi.getCountByProfile('Extern');
  },

  create: async (participantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(participantData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error creating participant:', error);
      throw error;
    }
  },

  update: async (id, participantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(participantData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error updating participant ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error deleting participant ${id}:`, error);
      throw error;
    }
  },

  getFormations: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/participants/${id}/formations`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching formations for participant ${id}:`, error);
      throw error;
    }
  },

  addFormation: async (participantId, formationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/participants/${participantId}/formations/${formationId}`,
        {
          method: 'POST',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error adding formation to participant:', error);
      throw error;
    }
  },

  removeFormation: async (participantId, formationId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/participants/${participantId}/formations/${formationId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error removing formation from participant:', error);
      throw error;
    }
  }
};

// Statistics API functions
export const statisticsApi = {
  getGlobalStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching global stats:', error);
      throw error;
    }
  },

  getFormationStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching formation stats:', error);
      throw error;
    }
  },

  getCompletedFormationsCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats/completed`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching completed formations count:', error);
      throw error;
    }
  },

  getCurrentFormationsCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats/current`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching current formations count:', error);
      throw error;
    }
  },

  getUpcomingFormationsCount: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats/upcoming`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching upcoming formations count:', error);
      throw error;
    }
  },

  getMonthlyStats: async (month, year) => {
    try {
      const response = await fetch(`${API_BASE_URL}/formations/stats/monthly?month=${month}&year=${year}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      throw error;
    }
  }
};
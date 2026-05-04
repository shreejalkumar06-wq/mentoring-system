const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('careerPlatformToken');
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || 'Request failed');
  }

  return body.data;
}

export const api = {
  signup(payload) {
    return request('/signup', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  login(payload) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  updateSkills(payload) {
    return request('/user/update-skills', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
  matchMentors() {
    return request('/match-mentor', {
      method: 'POST',
      body: JSON.stringify({})
    });
  },
  bookSession(payload) {
    return request('/book-session', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  submitQuiz(payload) {
    return request('/submit-quiz', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  submitCoding(payload) {
    return request('/submit-coding', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  dashboard(userId) {
    return request(`/dashboard/${userId}`);
  },
  roadmap(career) {
    return request(`/roadmap/${encodeURIComponent(career)}`);
  },
  projects(career) {
    return request(`/projects/${encodeURIComponent(career)}`);
  },
  submitProject(payload) {
    return request('/submit-project', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  userProjects(userId) {
    return request(`/user-projects/${userId}`);
  },
  matchJobs() {
    return request('/match-jobs', {
      method: 'POST',
      body: JSON.stringify({})
    });
  }
};

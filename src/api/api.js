const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const json = await response.json();
  const { status, message } = json;

  if (status !== 'success') {
    throw new Error(message);
  }

  return json.data;
}

async function fetchWithAuth(url, options = {}) {
  return fetchJson(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function register({ name, email, password }) {
  const { user } = await fetchJson(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  return user;
}

async function login({ email, password }) {
  const { token } = await fetchJson(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return token;
}

async function getOwnProfile() {
  const { user } = await fetchWithAuth(`${BASE_URL}/users/me`);
  return user;
}

async function getAllUsers() {
  const { users } = await fetchJson(`${BASE_URL}/users`);
  return users;
}

async function getAllThreads() {
  const { threads } = await fetchJson(`${BASE_URL}/threads`);
  return threads;
}

async function getThreadDetail(threadId) {
  const { detailThread } = await fetchJson(`${BASE_URL}/threads/${threadId}`);
  return detailThread;
}

async function createThread({ title, body, category }) {
  const { thread } = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, category }),
  });

  return thread;
}

async function createComment(threadId, content) {
  const { comment } = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  return comment;
}

async function upVoteThread(threadId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, { method: 'POST' });
}

async function downVoteThread(threadId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, { method: 'POST' });
}

async function neutralizeThreadVote(threadId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, { method: 'POST' });
}

async function upVoteComment(threadId, commentId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`, {
    method: 'POST',
  });
}

async function downVoteComment(threadId, commentId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`, {
    method: 'POST',
  });
}

async function neutralizeCommentVote(threadId, commentId) {
  await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`, {
    method: 'POST',
  });
}

async function getLeaderboards() {
  const { leaderboards } = await fetchJson(`${BASE_URL}/leaderboards`);
  return leaderboards;
}

export default {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralizeThreadVote,
  upVoteComment,
  downVoteComment,
  neutralizeCommentVote,
  getLeaderboards,
};

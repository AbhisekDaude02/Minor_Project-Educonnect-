
import API from "../api/axios";

// GET /api/connections/users
export const getCommunityUsers = () => {
  return API.get("/connections/users");
};

// POST /api/connections/sendrequest/:userId
export const sendFriendRequest = (userId) => {
  return API.post(`/connections/sendrequest/${userId}`);
};

// GET /api/connections/getrequest
export const getIncomingRequests = () => {
  return API.get("/connections/getrequest");
};

// PUT /api/connections/acceptrequest/:requestId
export const acceptFriendRequest = (requestId) => {
  return API.put(
    `/connections/acceptrequest/${requestId}`
  );
};

// PUT /api/connections/rejectrequest/:requestId
export const rejectFriendRequest = (requestId) => {
  return API.put(
    `/connections/rejectrequest/${requestId}`
  );
};

// GET /api/connections/getfriends
export const getMyFriends = () => {
  return API.get("/connections/getfriends");
};

// GET /api/connections/profile/:userId
export const getPublicProfile = (userId) => {
  return API.get(
    `/connections/profile/${userId}`
  );
};

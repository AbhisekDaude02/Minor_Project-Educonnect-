
import API from "../api/axios";

export const getConversations = () =>
  API.get("/message/getallmessage");

export const getMessages = (userId) =>
  API.get(`/message/getmessage/${userId}`);

export const markRead = (userId) =>
  API.put(`/message/read/${userId}`);

export const sendTextMessage = (userId, content) =>
  API.post(`/message/sendmessage/${userId}`, {
    content,
    type: "text",
  });

export const sendAttachment = (
  userId,
  file,
  type,
  content = ""
) => {
  const formData = new FormData();

  formData.append("attachment", file);
  formData.append("type", type);
  formData.append("content", content);

  return API.post(
    `/message/sendmessage/${userId}`,
    formData
  );
};

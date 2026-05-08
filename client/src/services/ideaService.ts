import axios from 'axios';

export interface Idea {
  id: string;
  title: string;
  description: string;
  complexity: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const getIdeas = async (): Promise<Idea[]> => {
  const { data } = await axios.get(`${API_URL}/ideas`);
  return data;
};

export const createIdea = async (idea: Partial<Idea>): Promise<Idea> => {
  const { data } = await axios.post(`${API_URL}/ideas`, idea);
  return data;
};

export const updateIdea = async (id: string, idea: Partial<Idea>): Promise<void> => {
  await axios.put(`${API_URL}/ideas/${id}`, idea);
};

export const deleteIdea = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/ideas/${id}`);
};

export const getArchivedIdeas = async (): Promise<Idea[]> => {
  const { data } = await axios.get(`${API_URL}/ideas/archived`);
  return data;
};

export const restoreIdea = async (id: string): Promise<void> => {
  await axios.post(`${API_URL}/ideas/${id}/restore`);
};

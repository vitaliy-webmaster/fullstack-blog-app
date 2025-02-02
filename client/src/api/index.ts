import queryString from 'query-string';
import { Post, User } from '../types';
import {
  CreatePostStartData,
  PaginationData,
  SignUpStartData,
  UpdatePostStartData,
  UpdateUserStartData,
} from '../redux/thunks';
import removeEmptyKeys from '../helpers/removeEmptyKeys';

interface APIData {
  users: {
    logIn: (email: string, password: string) => Promise<User>;
    logOut: () => Promise<string>;
    signUp: (values: SignUpStartData) => Promise<User>;
    refetchAuth: () => Promise<User>;
    updateUser: (values: UpdateUserStartData) => Promise<User>;
  };
  posts: {
    getAllPosts: (
      pagination: PaginationData
    ) => Promise<{ total: number; posts: Post[] }>;
    getTagPosts: (
      pagination: PaginationData,
      search: string
    ) => Promise<{ total: number; posts: Post[] }>;
    getUserPosts: (
      pagination: PaginationData
    ) => Promise<{ total: number; posts: Post[] }>;
    likePost: (id: string) => Promise<Post>;
    unlikePost: (id: string) => Promise<Post>;
    deletePost: (id: string) => Promise<string>;
    getCurrentPost: (id: string) => Promise<Post>;
    updatePost: (values: UpdatePostStartData) => Promise<Post>;
    createPost: (values: CreatePostStartData) => Promise<Post>;
  };
}

const API: APIData = {
  users: {
    logIn: async (email, password) => {
      const response = await fetch(`/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Invalid Login Attempt');
      }
    },
    logOut: async () => {
      const response = await fetch(`/api/v1/auth/logout`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Invalid Logout Attempt');
      }
    },
    signUp: async (values) => {
      try {
        const response = await fetch(`/api/v1/auth/signup`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        throw error;
      }
    },
    refetchAuth: async () => {
      const response = await fetch(`/api/v1/users/me`, {
        credentials: 'include',
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Invalid Cookie Authentication Attempt');
      }
    },
    updateUser: async ({ id, ...rest }) => {
      const response = await fetch(`/api/v1/users/${id}`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...rest }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Invalid User Update Attempt');
      }
    },
  },
  posts: {
    getAllPosts: async (pagination) => {
      const query = queryString.stringify(removeEmptyKeys(pagination));
      const response = await fetch(`/api/v1/posts?${query}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while fetching posts');
      }
    },
    getTagPosts: async (pagination, search) => {
      const query = queryString.stringify(removeEmptyKeys(pagination));
      const response = await fetch(`/api/v1/posts/by-tag?${query}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: search && search.length > 0 ? search.split(' ') : [],
        }),
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while fetching posts by tag');
      }
    },
    getUserPosts: async (pagination) => {
      const query = queryString.stringify(removeEmptyKeys(pagination));
      const response = await fetch(`/api/v1/posts/my-posts?${query}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while fetching user posts');
      }
    },
    likePost: async (id) => {
      const response = await fetch(`/api/v1/posts/${id}/like`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while liking post');
      }
    },
    unlikePost: async (id) => {
      const response = await fetch(`/api/v1/posts/${id}/unlike`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while unliking post');
      }
    },
    deletePost: async (id) => {
      const response = await fetch(`/api/v1/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while deleting post');
      }
    },
    getCurrentPost: async (id) => {
      const response = await fetch(`/api/v1/posts/${id}`);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error while fetching post');
      }
    },
    updatePost: async ({ id, ...rest }) => {
      try {
        const response = await fetch(`/api/v1/posts/${id}`, {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...rest }),
        });
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        throw error;
      }
    },
    createPost: async (values) => {
      try {
        const response = await fetch(`/api/v1/posts`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (response.ok) {
          return data;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        throw error;
      }
    },
  },
};

export default API;

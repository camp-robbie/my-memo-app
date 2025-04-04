import axios from 'axios';

// API 기본 URL
const API_BASE_URL = '/api';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청에 쿠키 포함
});

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API 요청 중 오류가 발생했습니다:', error);
    return Promise.reject(error);
  }
);

/**
 * 메모 서비스 API
 */
const memoService = {
  // 전체 메모 가져오기
  getAllMemos: async () => {
    try {
      return await api.get('/memos');
    } catch (error) {
      console.error('메모 목록을 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 메모 상세 조회
  getMemoById: async (id) => {
    try {
      return await api.get(`/memos/${id}`);
    } catch (error) {
      console.error(`메모 ID ${id}를 불러오는 중 오류가 발생했습니다:`, error);
      throw error;
    }
  },

  // 새 메모 생성
  createMemo: async (memoData) => {
    try {
      const response = await api.post('/memos', {
        title: memoData.title,
        content: memoData.content
      });
      return response;
    } catch (error) {
      console.error('메모 생성 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 메모 수정
  updateMemo: async (id, updatedData) => {
    try {
      const response = await api.put(`/memos/${id}`, {
        title: updatedData.title,
        content: updatedData.content
      });
      return response;
    } catch (error) {
      console.error('메모 수정 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 메모 삭제
  deleteMemo: async (id) => {
    try {
      await api.delete(`/memos/${id}`);
      return { success: true };
    } catch (error) {
      console.error('메모 삭제 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 목록 조회
  getComments: async (memoId) => {
    try {
      return await api.get(`/memos/${memoId}/comments`);
    } catch (error) {
      console.error('댓글 목록을 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 추가
  addComment: async (memoId, commentData) => {
    try {
      const response = await api.post(`/memos/${memoId}/comments`, {
        content: commentData.text
      });
      return {
        id: response.id,
        text: response.content,
        author: commentData.author,
        date: response.createdAt || new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('댓글 추가 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 수정
  updateComment: async (commentId, updatedText) => {
    try {
      const response = await api.put(`/comments/${commentId}`, {
        content: updatedText
      });
      return response;
    } catch (error) {
      console.error('댓글 수정 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return { success: true };
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      throw error;
    }
  }
};

export default memoService;
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
 * 댓글 객체를 일관된 형식으로 변환하는 유틸리티 함수
 */
const normalizeComment = (comment) => {
  if (!comment) {
    console.error('유효하지 않은 댓글 데이터:', comment);
    return {
      id: Date.now(),
      text: '오류: 댓글을 불러올 수 없습니다.',
      content: '오류: 댓글을 불러올 수 없습니다.',
      author: '시스템',
      date: new Date().toISOString()
    };
  }
  
  // 댓글 내용 확인
  const commentContent = comment.content || comment.text || '';
  
  // ID 검증 및 생성
  const commentId = comment.id || Date.now();
  
  return {
    id: commentId,
    // text와 content 필드를 모두 설정 (클라이언트측 호환성)
    text: commentContent,
    content: commentContent,
    author: comment.author || '익명',
    date: comment.updatedAt || comment.createdAt || comment.date || new Date().toISOString()
  };
};

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
      console.log('메모 생성 API 요청:', memoData);
      
      // 서버에 보낼 날짜를 한국 시간대로 변환
      let updatedAt = memoData.date;
      if (updatedAt) {
        // 이미 날짜 문자열이 있는 경우 한국 시간 형식으로 변환
        try {
          const date = new Date(updatedAt);
          updatedAt = new Date(date.getTime()).toISOString();
        } catch (e) {
          console.error('날짜 변환 오류:', e);
          updatedAt = new Date().toISOString();
        }
      } else {
        updatedAt = new Date().toISOString();
      }
      
      const response = await api.post('/memos', {
        title: memoData.title,
        content: memoData.content,
        author: memoData.author,
        updatedAt: updatedAt
      });
      console.log('메모 생성 API 응답:', response);
      return response;
    } catch (error) {
      console.error('메모 생성 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 메모 수정
  updateMemo: async (id, updatedData) => {
    try {
      // 서버에 보낼 날짜를 한국 시간대로 변환
      let updatedAt = updatedData.date;
      if (updatedAt) {
        // 이미 날짜 문자열이 있는 경우 한국 시간 형식으로 변환
        try {
          const date = new Date(updatedAt);
          updatedAt = new Date(date.getTime()).toISOString();
        } catch (e) {
          console.error('날짜 변환 오류:', e);
          updatedAt = new Date().toISOString();
        }
      } else {
        updatedAt = new Date().toISOString();
      }
      
      const response = await api.put(`/memos/${id}`, {
        title: updatedData.title,
        content: updatedData.content,
        author: updatedData.author, // 작성자 정보도 포함
        updatedAt: updatedAt // 날짜와 시간 정보 포함
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
      const comments = await api.get(`/memos/${memoId}/comments`);
      // 댓글 데이터 정규화
      return Array.isArray(comments) 
        ? comments.map(normalizeComment) 
        : [];
    } catch (error) {
      console.error('댓글 목록을 불러오는 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 추가
  addComment: async (memoId, commentData) => {
    try {
      console.log('댓글 추가 요청 데이터:', commentData);
      // 현재 시간을 ISO 문자열로 변환 (UTC)
      const currentDateTime = new Date().toISOString();
      
      // 서버에 전송할 데이터 형식 맞추기
      const requestData = {
        content: commentData.text,
        author: commentData.author,
        createdAt: currentDateTime
      };
      console.log('서버에 전송할 댓글 데이터:', requestData);
      
      const response = await api.post(`/memos/${memoId}/comments`, requestData);
      console.log('서버 응답 데이터:', response);
      
      // 응답 데이터가 없는 경우 기본값 설정
      if (!response) {
        console.warn('서버가 빈 응답을 반환했습니다. 기본 데이터를 사용합니다.');
        return normalizeComment({
          id: Date.now(),
          content: commentData.text,
          author: commentData.author,
          createdAt: currentDateTime
        });
      }
      
      // 반환된 댓글 데이터를 클라이언트 형식으로 정규화
      return normalizeComment({
        id: response.id,
        content: response.content || commentData.text,
        author: response.author || commentData.author,
        date: response.updatedAt || response.createdAt || currentDateTime
      });
    } catch (error) {
      console.error('댓글 추가 중 오류가 발생했습니다:', error);
      throw error;
    }
  },

  // 댓글 수정
  updateComment: async (commentId, updatedText) => {
    try {
      const currentDateTime = new Date().toISOString();
      const response = await api.put(`/comments/${commentId}`, {
        content: updatedText,
        updatedAt: currentDateTime
      });
      
      // 응답을 표준 형식으로 반환
      return normalizeComment({
        id: commentId,
        content: response.content || updatedText,
        author: response.author,
        date: response.updatedAt || currentDateTime
      });
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
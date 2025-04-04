/**
 * Mock 데이터 서비스
 * 백엔드 API가 준비되지 않았거나 개발 환경에서 테스트할 때 사용합니다.
 * 실제 서비스에서는 src/api/memoService.js를 사용하세요.
 */

// 로컬 스토리지 키
const MEMOS_STORAGE_KEY = 'memo-app-memos';

// 초기 더미 데이터
const initialMemos = [
  {
    id: 1,
    title: '회의 내용 정리',
    content: '오늘 회의에서는 다음과 같은 내용이 논의되었습니다.\n1. 프로젝트 일정 검토\n2. 담당자 배정\n3. 다음 회의 일정',
    author: '김철수',
    createdAt: '2025-04-01',
    comments: [
      {
        id: 101,
        content: '회의 내용 잘 정리해주셔서 감사합니다!',
        author: '이영희',
        createdAt: '2025-04-02'
      },
      {
        id: 102,
        content: '다음 회의는 금요일 오후 2시로 확정되었습니다.',
        author: '박지훈',
        createdAt: '2025-04-03'
      }
    ]
  },
  {
    id: 2,
    title: 'JPA 스터디 준비',
    content: '다음 주 JPA 스터디를 위한 주제 정리:\n- 영속성 컨텍스트\n- 엔티티 매핑\n- JPQL 기본 문법',
    author: '이지은',
    createdAt: '2025-04-03',
    comments: []
  }
];

// 로컬 스토리지에서 메모 불러오기
const getMemos = () => {
  try {
    const storedMemos = localStorage.getItem(MEMOS_STORAGE_KEY);
    return storedMemos ? JSON.parse(storedMemos) : initialMemos;
  } catch (error) {
    console.error('메모를 불러오는 중 오류가 발생했습니다:', error);
    return initialMemos;
  }
};

// 로컬 스토리지에 메모 저장
const saveMemos = (memos) => {
  try {
    localStorage.setItem(MEMOS_STORAGE_KEY, JSON.stringify(memos));
  } catch (error) {
    console.error('메모를 저장하는 중 오류가 발생했습니다:', error);
  }
};

// 지연 시간 함수 (API 호출 시뮬레이션)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 메모 서비스 Mock API
const mockService = {
  // 전체 메모 가져오기
  getAllMemos: async () => {
    await delay(500); // API 지연 시뮬레이션
    return getMemos();
  },

  // 메모 상세 조회
  getMemoById: async (id) => {
    await delay(300);
    const memos = getMemos();
    const memo = memos.find(memo => memo.id === Number(id));
    if (!memo) {
      throw new Error(`ID ${id}인 메모를 찾을 수 없습니다.`);
    }
    return memo;
  },

  // 새 메모 생성
  createMemo: async (memoData) => {
    await delay(400);
    const memos = getMemos();
    const newMemo = {
      id: Date.now(),
      title: memoData.title,
      content: memoData.content,
      author: memoData.author || '익명',
      createdAt: new Date().toISOString().split('T')[0],
      comments: []
    };

    const updatedMemos = [...memos, newMemo];
    saveMemos(updatedMemos);
    return newMemo;
  },

  // 메모 수정
  updateMemo: async (id, updatedData) => {
    await delay(400);
    const memos = getMemos();
    const memoIndex = memos.findIndex(memo => memo.id === Number(id));
    
    if (memoIndex === -1) {
      throw new Error(`ID ${id}인 메모를 찾을 수 없습니다.`);
    }

    const updatedMemo = {
      ...memos[memoIndex],
      title: updatedData.title,
      content: updatedData.content,
      author: updatedData.author || memos[memoIndex].author,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    memos[memoIndex] = updatedMemo;
    saveMemos(memos);
    return updatedMemo;
  },

  // 메모 삭제
  deleteMemo: async (id) => {
    await delay(300);
    const memos = getMemos();
    const updatedMemos = memos.filter(memo => memo.id !== Number(id));
    
    if (updatedMemos.length === memos.length) {
      throw new Error(`ID ${id}인 메모를 찾을 수 없습니다.`);
    }
    
    saveMemos(updatedMemos);
    return { success: true };
  },

  // 댓글 목록 조회
  getComments: async (memoId) => {
    await delay(300);
    const memos = getMemos();
    const memo = memos.find(memo => memo.id === Number(memoId));
    
    if (!memo) {
      throw new Error(`ID ${memoId}인 메모를 찾을 수 없습니다.`);
    }
    
    // 댓글 데이터 형식 일관되게 변환
    return (memo.comments || []).map(comment => ({
      id: comment.id,
      text: comment.content,
      content: comment.content,
      author: comment.author || '익명',
      date: comment.updatedAt || comment.createdAt
    }));
  },

  // 댓글 추가
  addComment: async (memoId, commentData) => {
    await delay(400);
    const memos = getMemos();
    const memoIndex = memos.findIndex(memo => memo.id === Number(memoId));
    
    if (memoIndex === -1) {
      throw new Error(`ID ${memoId}인 메모를 찾을 수 없습니다.`);
    }

    const currentDateTime = new Date().toISOString();
    const newComment = {
      id: Date.now(),
      content: commentData.text,
      author: commentData.author || '익명',
      createdAt: currentDateTime
    };

    memos[memoIndex].comments = [...(memos[memoIndex].comments || []), newComment];
    saveMemos(memos);
    
    // 클라이언트 측 데이터 구조에 맞게 일관성 있게 변환
    return {
      id: newComment.id,
      text: newComment.content,
      content: newComment.content,
      author: newComment.author,
      date: newComment.createdAt
    };
  },

  // 댓글 수정
  updateComment: async (commentId, updatedText) => {
    await delay(300);
    const memos = getMemos();
    let commentUpdated = false;
    
    const updatedMemos = memos.map(memo => {
      if (memo.comments && memo.comments.length > 0) {
        const commentIndex = memo.comments.findIndex(comment => comment.id === Number(commentId));
        if (commentIndex !== -1) {
          commentUpdated = true;
          const updatedComment = {
            ...memo.comments[commentIndex],
            content: updatedText,
            updatedAt: new Date().toISOString().split('T')[0]
          };
          memo.comments[commentIndex] = updatedComment;
          return { ...memo };
        }
      }
      return memo;
    });

    if (!commentUpdated) {
      throw new Error(`ID ${commentId}인 댓글을 찾을 수 없습니다.`);
    }

    saveMemos(updatedMemos);
    return { success: true };
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    await delay(300);
    const memos = getMemos();
    let commentDeleted = false;
    
    const updatedMemos = memos.map(memo => {
      if (memo.comments && memo.comments.length > 0) {
        const initialCommentCount = memo.comments.length;
        memo.comments = memo.comments.filter(comment => comment.id !== Number(commentId));
        
        if (initialCommentCount > memo.comments.length) {
          commentDeleted = true;
          return { ...memo };
        }
      }
      return memo;
    });

    if (!commentDeleted) {
      throw new Error(`ID ${commentId}인 댓글을 찾을 수 없습니다.`);
    }

    saveMemos(updatedMemos);
    return { success: true };
  }
};

export default mockService;
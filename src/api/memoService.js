/**
 * 메모 및 댓글 관련 API 서비스
 * (현재는 로컬 스토리지를 사용하는 가상 서비스)
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
    date: '2025-04-01',
    comments: [
      {
        id: 101,
        text: '회의 내용 잘 정리해주셔서 감사합니다!',
        author: '이영희',
        date: '2025-04-02'
      },
      {
        id: 102,
        text: '다음 회의는 금요일 오후 2시로 확정되었습니다.',
        author: '박지훈',
        date: '2025-04-03'
      }
    ]
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

// 메모 서비스 API
const memoService = {
  // 전체 메모 가져오기
  getAllMemos: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMemos());
      }, 300); // 실제 API 지연 시뮬레이션
    });
  },

  // 새 메모 생성
  createMemo: (memoData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const newMemo = {
          id: Date.now(),
          title: memoData.title,
          content: memoData.content,
          author: memoData.author,
          date: memoData.date || new Date().toISOString().split('T')[0],
          comments: []
        };

        const updatedMemos = [...memos, newMemo];
        saveMemos(updatedMemos);
        resolve(newMemo);
      }, 300);
    });
  },

  // 메모 수정
  updateMemo: (id, updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const updatedMemos = memos.map(memo => 
          memo.id === id ? { ...memo, ...updatedData } : memo
        );

        saveMemos(updatedMemos);
        const updatedMemo = updatedMemos.find(memo => memo.id === id);
        resolve(updatedMemo);
      }, 300);
    });
  },

  // 메모 삭제
  deleteMemo: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const updatedMemos = memos.filter(memo => memo.id !== id);
        saveMemos(updatedMemos);
        resolve({ success: true });
      }, 300);
    });
  },

  // 댓글 추가
  addComment: (memoId, commentData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const updatedMemos = memos.map(memo => {
          if (memo.id === memoId) {
            const newComment = {
              id: Date.now(),
              text: commentData.text,
              author: commentData.author,
              date: new Date().toISOString().split('T')[0]
            };
            return {
              ...memo,
              comments: [...(memo.comments || []), newComment]
            };
          }
          return memo;
        });

        saveMemos(updatedMemos);
        const memo = updatedMemos.find(m => m.id === memoId);
        const newComment = memo.comments[memo.comments.length - 1];
        resolve(newComment);
      }, 300);
    });
  },

  // 댓글 수정
  updateComment: (memoId, commentId, updatedText) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const updatedMemos = memos.map(memo => {
          if (memo.id === memoId) {
            const updatedComments = memo.comments.map(comment => 
              comment.id === commentId ? { ...comment, text: updatedText } : comment
            );
            return { ...memo, comments: updatedComments };
          }
          return memo;
        });

        saveMemos(updatedMemos);
        const memo = updatedMemos.find(m => m.id === memoId);
        const updatedComment = memo.comments.find(c => c.id === commentId);
        resolve(updatedComment);
      }, 300);
    });
  },

  // 댓글 삭제
  deleteComment: (memoId, commentId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const memos = getMemos();
        const updatedMemos = memos.map(memo => {
          if (memo.id === memoId) {
            const updatedComments = memo.comments.filter(comment => comment.id !== commentId);
            return { ...memo, comments: updatedComments };
          }
          return memo;
        });

        saveMemos(updatedMemos);
        resolve({ success: true });
      }, 300);
    });
  }
};

export default memoService;
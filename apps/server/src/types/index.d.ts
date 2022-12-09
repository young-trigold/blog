export interface UserInfo {
  name: string;
  pwd: string;
  role: string;
  id: string;
}

export interface CommentInfo {
  id: string;
  content: string;
  user: UserInfo;
}

export interface ChapterInfo {
  id: string;
  title: string;
  url: string;
  views: number;
  likes: number;
  comments: CommentInfo[];
}

export interface NoteInfo {
  id: string;
  title: string;
  sortedIndex: number;
  chapters: ChapterInfo[];
}

declare global {
  namespace Express {
    interface Request {
      user: UserInfo;
    }
  }
}

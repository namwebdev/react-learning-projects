export interface User {
  avatar_url: string;
  id: string;
  name: string;
}

export interface Message {
  content: string;
  created_at: string;
  id: string;
  is_deleted: boolean;
  is_edited: boolean;
  user_id: string;
}

export interface MessageWithSender extends Message {
  users: User;
}
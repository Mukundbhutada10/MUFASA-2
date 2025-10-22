export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  author: MessageAuthor;
  content: string;
  id: string;
}

import { Injectable } from '@angular/core';
import { Chat, ChatMessage } from '../models/model';
import {
  SY_FriendChatDTO,
  SY_MessageDTO,
  SY_ResponseStatus,
} from '../models/dto';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _messagesService: MessagesService) {}

  emptyGuid: string = '00000000-0000-0000-0000-000000000000';

  cachedChats: Array<Chat> = [];
  activeChats: Array<Chat> = [];
  helloContainerActive: Boolean = true;

  showChat(friendChat: SY_FriendChatDTO) {
    const exists = this.activeChats.some(
      (chat) => chat.chatInfo.friend.guid === friendChat.friend.guid
    );

    if (exists) {
      console.log('Chat already exists: ' + friendChat.friend.guid);
    } else {
      // remove the first chat
      if (this.activeChats.length === 4) {
        this.activeChats.shift();
      }

      const cachedChat = this.cachedChats.find(
        (chat) => chat.chatInfo.friend.guid === friendChat.friend.guid
      );

      let chat: Chat;

      if (cachedChat) {
        chat = cachedChat;
        this.activeChats.push(chat);
      } else {
        let syMessages: Array<SY_MessageDTO> = [];
        // Fetch messages from API
        this._messagesService.getMessages(friendChat.chatGuid).subscribe({
          next: (fetchedMessages: Array<SY_MessageDTO>) => {
            syMessages = fetchedMessages;
            console.log('Messages fetched');

            syMessages = syMessages.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

            const chatMessages: Array<ChatMessage> =
              this.convertMessages(syMessages);
            console.log('chatMessages', chatMessages);

            chat = {
              chatInfo: friendChat,
              messages: chatMessages,
            };

            this.addToCachedChats(chat);
            this.activeChats.push(chat);
            console.log('Chat added: ' + friendChat.friend.guid);
            this.checkHelloContainer();
          },
          error: (error) => {
            console.error('Failed to fetch messages:', error);
          },
        });
      }
    }
    this.checkHelloContainer();
  }

  closeChat(friendGuid: string) {
    this.activeChats = this.activeChats.filter(
      (chat) => chat.chatInfo.friend.guid !== friendGuid
    );
    this.checkHelloContainer();
  }

  sendMessage(chatGuid: string, content: string) {
    this._messagesService.sendMessage(chatGuid, content).subscribe({
      next: (response: SY_ResponseStatus) => {
        if (response.success) {
          console.log(response.message);
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => {
        console.error('Unexpected error:', error);
      },
    });
  }

  // ----------------------------
  // Helpers
  // ----------------------------
  checkHelloContainer(){
    this.helloContainerActive = this.activeChats.length === 0;
  }

  addToCachedChats(chat: Chat) {
    if (chat) {
      const exists = this.cachedChats.some(
        (chat) => chat.chatInfo.friend.guid === chat.chatInfo.friend.guid
      );
      if (!exists) {
        this.cachedChats.push(chat);
        console.log('Chat cached:', chat);
      }
    }
  }

  convertMessages(messages: SY_MessageDTO[]): ChatMessage[] {
    let previousDate = '';
    return messages.map((message) => {
      const dateObj = new Date(message.sentAt);

      // Date formatting
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = String(dateObj.getFullYear()).padStart(2, '0');
      const formattedDate = `${day}.${month}.${year}`;

      // Time formatting
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      const otherDate = previousDate !== formattedDate ? 1 : 0;
      previousDate = formattedDate;

      return {
        guid: message.guid,
        chatGuid: message.chatGuid,
        senderGuid: message.senderGuid,
        content: message.content,
        sentAt: message.sentAt,
        date: formattedDate,
        time: formattedTime,
        otherDate: otherDate,
      };
    });
  }
}

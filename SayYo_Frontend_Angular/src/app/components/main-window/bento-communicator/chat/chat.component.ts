import { ChatService } from './../../../../services/chat.service';
import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';
import { SY_FriendChatDTO } from '../../../../models/dto';
import { Chat } from '../../../../models/model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  constructor(
    protected chatService: ChatService,
    protected accountService: AccountService
  ) {}

  // // DATA
  // friendshipList: any; // id, userId, friendId, status, blockFromUser, blockFromFriend
  // usersDTOList: any; // list of all userDTO (id, userName, email)
  // strangersDTOList: any; // list of strangers UserDTO type
  // friends: any; // only friends - id, name, status, isSelected (creating group purposes), options (0 - closed, 1 - opened), isBlockedFriend (not in sql: false, true), invitation (not in sql: false, true)
  // friendsChats: any; // list of: chatId, chatType, chatName, friend(id, memberId, userName, email, chatRole, friendshipStatus)
  // chatsMessages: any; // list of (chatId, list of message(id, chatId, senderId, content, sentAt, date, time, otherDate))

  // // uzywne niby

  // activeFriend: any; // friend retrieved from friends
  // activeChatContent: any; // active chat retrieved from friendsChats
  // activeChatMessages: any;// active chat content retrieved from chatsMessages
  // // FLAGS
  // activeChat: Boolean = false; // true if there are messages
  // UserGuid: any;

  startChatClick(friendChat: SY_FriendChatDTO) {
    this.chatService.startChat(friendChat);
  }

  sendMessageClick(chat: Chat) {
    const message = chat.currentMessage?.trim();
    if (message && message.length !== 0) {
      this.chatService.sendMessage(chat.chatInfo.chatGuid, message);
    }
    chat.currentMessage = "";
  }

  ngOnInit() {
    this.chatService.messageHubSetup();
  }
}

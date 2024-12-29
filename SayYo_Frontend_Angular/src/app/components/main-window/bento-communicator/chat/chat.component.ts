import { ChatService } from './../../../../services/chat.service';
import { Component } from '@angular/core';
import { AccountService } from '../../../../services/account.service';

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

  myMessage: string = ''; // from writearea

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

  startChatClick() {}

  sendMessageClick(chatGuid: string) {
    if (this.myMessage.length !== 0) {
      this.chatService.sendMessage(chatGuid, this.myMessage);
    }
  }
}

import { Injectable } from '@angular/core';
import { Chat, ChatMessage } from '../models/model';
import {
  SY_FriendChatDTO,
  SY_MessageDTO,
  SY_ResponseStatus,
  SY_AddChatMemberDTO,
  SY_AddChatDTO,
  SY_UpdateChatMemberDTO,
} from '../models/dto';
import { MessagesService } from './messages.service';
import { Observable } from 'rxjs';
import { ConnectionService } from './connection.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { FriendshipService } from './friendship.service';
import { MessageHubService } from './message-hub.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private _messagesService: MessagesService,
    private _conn: ConnectionService,
    private _account: AccountService,
    private _friendshipService: FriendshipService,
    private _messageHubService: MessageHubService,
    private _http: HttpClient
  ) {}

  emptyGuid: string = '00000000-0000-0000-0000-000000000000';

  cachedChats: Array<Chat> = [];
  activeChats: Array<Chat> = [];
  helloContainerActive: Boolean = true;

  messageHubSetup(){
    this._messageHubService.startConnection(this._account.TEST_UserGuid);

    this._messageHubService.onReceiveMessage((message) => {
      console.log("Received message", message);
    });

    console.log("Setup Message Hub Service");
  }

  startChat(friendChat: SY_FriendChatDTO) {
    // friendship status - awaiting - 0
    if (friendChat.friend.friendshipStatus == 0) {
      // Confirm friendship - accept friend request
      this._friendshipService.updateFriendshipStatus(
        friendChat.friend.guid,
        1,
        0,
        0
      );
    }

    const addChat: SY_AddChatDTO = {
      chatType: 0,
      name: '-',
    };
    this.createChat(addChat).subscribe(async (res) => {
      const chatGuid = String(res);
      // They are both admins in private chat
      this.addChatMember(chatGuid, this._account.TEST_UserGuid, 1).subscribe(
        (_res) => {}
      );
      this.addChatMember(chatGuid, friendChat.friend.guid, 1).subscribe(
        (_res) => {}
      );
      //TODO: refreshing doesnt wor
      //this.loadChats();
      // this.activeChatContent = this.friendsChats.find(fc=>fc.chatId == chatGuid);
      // this.chatClicked(this.activeChatContent);
    });
  }

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

            syMessages = syMessages.sort(
              (a, b) =>
                new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
            );

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
  // ENDPOINTS
  // ----------------------------

  // // List of ChatMemberDTO
  // getUsersForChat(chatGuid: string): Observable<any[]> {
  //   return this._http.get<any[]>(
  //     this._conn.API_URL + 'sayyo/chat/getUsersForChat?chatGuid=' + chatGuid
  //   );
  // }

  // Returns Created and chatGuid
  createChat(addChat: SY_AddChatDTO) {
    return this._http.post(
      this._conn.API_URL + 'sayyo/chat/createChat/',
      addChat
    );
  }

  // Returns Created and chat member guid
  addChatMember(chatGuid: string, userGuid: string, memberRole: number = 0) {
    const addChatMember: SY_AddChatMemberDTO = {
      chatGuid: chatGuid,
      userGuid: userGuid,
      role: memberRole,
    };
    return this._http.post(
      this._conn.API_URL + 'sayyo/chat/addChatMember/',
      addChatMember
    );
  }

  // Returns no content
  // updateChatMember(
  //   memberGuid: string,
  //   chatGuid: string,
  //   userGuid: string,
  //   chatRole: number = 0
  // ) {
  //   const updateChatMember: SY_UpdateChatMemberDTO = {
  //     memberGuid: memberGuid,
  //     chatGuid: chatGuid,
  //     userGuid: userGuid,
  //     role: chatRole,
  //   };
  //   return this._http.put(
  //     this._conn.API_URL + 'sayyo/chat/updateChatMember/',
  //     updateChatMember
  //   );
  // }

  // Returns no content
  // deleteChatMember(guid: string) {
  //   return this._http.delete(
  //     this._conn.API_URL + 'sayyo/chat/deleteChatMember?guid=' + guid
  //   );
  // }

  // ----------------------------
  // Helpers
  // ----------------------------
  checkHelloContainer() {
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

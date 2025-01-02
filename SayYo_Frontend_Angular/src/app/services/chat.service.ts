import { EventEmitter, Injectable } from '@angular/core';
import { Chat, ChatMessage } from '../models/model';
import {
  SY_ChatDTO,
  SY_MessageDTO,
  SY_ResponseStatus,
  SY_AddChatMemberDTO,
  SY_AddChatDTO,
  SY_UpdateChatMemberDTO,
  SY_CreateGroupChatDTO,
} from '../models/dto';
import { MessagesService } from './messages.service';
import { ConnectionService } from './connection.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from './account.service';
import { FriendshipService } from './friendship.service';
import { MessageHubService } from './message-hub.service';
import { Observable, Subscription } from 'rxjs';
import { MembershipService } from './membership.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private _membershipService: MembershipService,
    private _messagesService: MessagesService,
    private _conn: ConnectionService,
    private _account: AccountService,
    private _friendshipService: FriendshipService,
    private _messageHubService: MessageHubService,
    private _http: HttpClient
  ) {}

  public onNewMessage: EventEmitter<void> = new EventEmitter<void>();
  private cleanup_Subscription!: Subscription;

  emptyGuid: string = '00000000-0000-0000-0000-000000000000';

  cachedChats: Array<Chat> = [];
  activeChats: Array<Chat> = [];
  helloContainerActive: Boolean = true;

  messageHubSetup() {
    this._messageHubService.startConnection(this._account.account.userGuid);

    this._messageHubService.onReceiveMessage((message) => {
      this.handleNewMessage(message);
      this.onNewMessage.emit();
    });

    console.log('Setup Message Hub Service');

    // Add subscription for cleaning chat
    if (this.cleanup_Subscription) {
      this.cleanup_Subscription.unsubscribe();
    }
    this.cleanup_Subscription = this._account.cleanup_Emitter.subscribe(() => {
      this.releaseChats();
      this.stopSignalRConnection();
    });
  }

  handleNewMessage(message: SY_MessageDTO) {
    var cachedChat = this.cachedChats.find(
      (chat) => (chat.chatInfo.chatGuid === message.chatGuid)
    );
    // Create array
    let syMsgs = [message];
    const chatMsg = this.convertMessages(syMsgs);
    if (cachedChat) {
      cachedChat.messages.push(chatMsg[0]);
    }
  }

  startPrivateChat(friendChat: SY_ChatDTO) {
    // friendship status - awaiting - 0
    if (friendChat.members[0].friendshipStatus == 0) {
      // Confirm friendship - accept friend request
      this._friendshipService.updateFriendshipStatus(
        friendChat.members[0].guid,
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
      this._membershipService.addChatMember(chatGuid, this._account.account.userGuid, 1).subscribe(
        (_res) => {}
      );
      this._membershipService.addChatMember(chatGuid, friendChat.members[0].guid, 1).subscribe(
        (_res) => {}
      );
      //TODO: refreshing doesnt wor
      //this.loadChats();
      // this.activeChatContent = this.friendsChats.find(fc=>fc.chatId == chatGuid);
      // this.chatClicked(this.activeChatContent);
    });
  }

  showChat(targetChat: SY_ChatDTO) {
    const exists = this.activeChats.some(
      (chat) => this.isSameChat(chat.chatInfo, targetChat)
    );

    if (exists) {
      console.log('Chat already opened');
    } else {
      // remove the first chat
      if (this.activeChats.length === 4) {
        this.activeChats.shift();
      }

      const cachedChat = this.cachedChats.find(
        (chat) => this.isSameChat(chat.chatInfo, targetChat)
      );

      let chat: Chat;

      if (cachedChat) {
        chat = cachedChat;
        this.activeChats.push(chat);
      } else {
        chat = {
          chatInfo: targetChat,
          messages: [],
        };

        if (targetChat.chatGuid !== this.emptyGuid) {
          let syMessages: Array<SY_MessageDTO> = [];
          // Fetch messages from API
          this._messagesService.getMessages(targetChat.chatGuid).subscribe({
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

              chat.messages = chatMessages;

              this.addToCachedChats(chat);
              this.activeChats.push(chat);
              this.checkHelloContainer();
            },
            error: (error) => {
              console.error('Failed to fetch messages:', error);
            },
          });
        } else {
          this.addToCachedChats(chat);
          this.activeChats.push(chat);
          console.log('Start Chat added: ' + targetChat.members[0].userName);
        }
      }
    }
    this.checkHelloContainer();
  }

  closeChat(targetChat: Chat) {
    this.activeChats = this.activeChats.filter(
      (chat) => !this.isSameChat(chat.chatInfo, targetChat.chatInfo)
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

  deleteChat(chatGuid: string): Observable<any> {
    console.log("deleteChat: " + chatGuid);
    return this._http.delete(
      `${this._conn.API_URL}sayyo/chat/deleteChat?chatGuid=${chatGuid}`
    );
  }

  // Returns Created and chatGuid
  createChat(addChat: SY_AddChatDTO) {
    return this._http.post(
      this._conn.API_URL + 'sayyo/chat/createChat/',
      addChat
    );
  }

  // chatName: string, members: Array<{userGuid: string, role: int}>
  createGroup(groupPayload: SY_CreateGroupChatDTO): Observable<any> {
    return this._http.post<any>(
      this._conn.API_URL + 'sayyo/chat/createGroupChat/',
      groupPayload
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


  // ----------------------------
  // Helpers
  // ----------------------------
  releaseChats(){
    console.log("Before Released chats", this.activeChats, this.cachedChats);

    this.activeChats = [];
    this.cachedChats = [];
    console.log("Released chats", this.activeChats, this.cachedChats);
  }

  stopSignalRConnection() {
    this._messageHubService.stopConnection();
  }

  checkHelloContainer() {
    this.helloContainerActive = this.activeChats.length === 0;
  }

  addToCachedChats(targetChat: Chat) {
    if (targetChat) {
      const exists = this.cachedChats.some(
        (chat) => this.isSameChat(chat.chatInfo, targetChat.chatInfo)
      );
      if (!exists) {
        this.cachedChats.push(targetChat);
        console.log('Chat cached:', targetChat);
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

      let othDate = 1;
      if (messages.length === 1) {
        const chat = this.cachedChats.find(
          (chat) => chat.chatInfo.chatGuid === message.chatGuid
        );

        if (chat && chat.messages.length > 0) {
          const compareMsg = chat.messages[chat.messages.length - 1];
          othDate = compareMsg.date !== formattedDate ? 1 : 0;
        }
      } else {
        othDate = previousDate !== formattedDate ? 1 : 0;
      }

      const otherDate = othDate;
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

  isSameChat(chat: SY_ChatDTO, targetChat: SY_ChatDTO): boolean {
    return (
      chat.chatGuid === targetChat.chatGuid &&
      chat.members[0].guid === targetChat.members[0].guid
    );
  }
}

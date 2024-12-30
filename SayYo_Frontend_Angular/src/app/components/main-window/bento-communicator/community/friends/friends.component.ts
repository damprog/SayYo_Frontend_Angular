import { ContextMenu, MenuItem } from './../../../../../models/model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import {
  SY_FriendChatDTO,
  SY_ResponseStatus,
  SY_UserDTO,
} from '../../../../../models/dto';
import { ComponentsStateService } from '../../../../../services/components-state.service';
import { ChatService } from '../../../../../services/chat.service';
import { ContextMenuComponent } from '../../../../popup/context-menu/context-menu.component';
import { ContextMenuService } from '../../../../../services/context-menu.service';
import { FriendshipService } from '../../../../../services/friendship.service';
import { ModalService } from '../../../../../services/modal.service';
import { AccountService } from '../../../../../services/account.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent implements OnInit {
  searchOpen: boolean = false;
  searchPattern: string = '';

  // activeFriends: Array<SY_UserDTO> = [];
  // awaitingFriends: Array<SY_UserDTO> = [];
  // blockedFriends: Array<SY_UserDTO> = [];

  friendsChats_Ok: Array<SY_FriendChatDTO> = [];
  friendsChats_Awaiting: Array<SY_FriendChatDTO> = [];
  friendsChats_Blocked: Array<SY_FriendChatDTO> = [];

  friendsStatusComp$ = this._stateService.friendsStatus$;
  // @ViewChild(ChatBarContextMenuComponent)
  // contextMenu!: ChatBarContextMenuComponent;

  constructor(
    protected _modalService:ModalService,
    private _accountService: AccountService,
    private _friendshipService: FriendshipService,
    private _contacts: ContactsService,
    private _stateService: ComponentsStateService,
    private _chatService: ChatService,
    private _contextMenuService: ContextMenuService,
    public spinnerService: SpinnerService
  ) {}

  showContextMenu(event: MouseEvent, info: SY_FriendChatDTO): void {
    event.stopPropagation();
    var menuInfo: ContextMenu = {
      name: '',
      menuItems: [],
    };

    if (info.friend.friendshipStatus === 0) {
      menuInfo = this.prepareAwaitingFriendsMenu(info);
    } else if (info.friend.friendshipStatus === 1) {
      menuInfo = this.prepareActiveFriendsMenu(info);
    } else if (info.friend.friendshipStatus === 2) {
      menuInfo = this.prepareBlockedFriendsMenu(info);
    }

    this._contextMenuService.showMenu(event, menuInfo);
  }

  prepareActiveFriendsMenu(info: SY_FriendChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [
        {
          label: 'Zablokuj',
          action: () =>
            this._friendshipService.updateFriendshipStatus(
              info.friend.guid,
              2,
              1,
              info.friend.userBlockedMe
            ),
        },
        {
          label: 'Usuń znajomego',
          action: () =>
            this._friendshipService.deleteFriendship(
              info.friend.friendshipGuid
            ),
        },
      ],
    };
    return menuInfo;
  }

  prepareAwaitingFriendsMenu(info: SY_FriendChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [],
    };

    if (!info.friend.iInvited) {
      menuInfo.menuItems.push({
        label: 'Akceptuj',
        action: () =>
          this._friendshipService.updateFriendshipStatus(
            info.friend.guid,
            1,
            0,
            0
          ),
      });
      menuInfo.menuItems.push({
        label: 'Odrzuć',
        action: () =>
          this._friendshipService.updateFriendshipStatus(
            info.friend.guid,
            2,
            1,
            info.friend.userBlockedMe
          ),
      });
    } else {
      menuInfo.menuItems.push({
        label: 'Anuluj',
        action: () =>
          this._friendshipService.deleteFriendship(info.friend.friendshipGuid),
      });
    }

    return menuInfo;
  }

  prepareBlockedFriendsMenu(info: SY_FriendChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [],
    };

    if (info.friend.iBlockedUser) {
      menuInfo.menuItems.push({
        label: 'Odblokuj',
        action: () =>
          this._friendshipService.updateFriendshipStatus(
            info.friend.guid,
            1,
            0,
            info.friend.userBlockedMe
          ),
      });
      menuInfo.menuItems.push({
        label: 'Usuń',
        action: () =>
          this._friendshipService.deleteFriendship(info.friend.friendshipGuid),
      });
    } else {
      // No options for blocked user
    }

    return menuInfo;
  }

  showChat(friendChat: SY_FriendChatDTO) {
    console.log(
      'showChat(): ' +
        friendChat.chatGuid +
        ', chatName: ' +
        friendChat.chatName +
        ', friendGuid: ' +
        friendChat.friend.guid
    );
    this._chatService.showChat(friendChat);
  }

  showFriends_StatusOk() {
    this.loadActiveFriends();
    this._stateService.showFriends_StatusOk();
  }

  showFriends_StatusInvitations() {
    this.loadAwaitingFriends();
    this._stateService.showFriends_StatusInvitations();
  }

  showFriends_StatusBlocked() {
    this.loadBlockedFriends();
    this._stateService.showFriends_StatusBlocked();
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.searchPattern = '';
  }

  ngOnInit() {
    if(this._accountService.isLoggedIn){
      this.showFriends_StatusOk();
    }
  }

  loadActiveFriends() {
    console.log('loadActiveFriends');

    this.spinnerService.show();
    this.friendsChats_Ok = [];

    this._contacts.getFriendChats_Ok().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Ok = this._contacts.friendsChats_Ok.items;
        } else {
          this._modalService.showModal(result.message);
        }
      },
      error: (error) => {
        this._modalService.showModal('Wystąpił błąd podczas ładowania znajomych.');
        console.error('Error during loading active friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  loadAwaitingFriends() {
    console.log('loadAwaitingFriends ');

    this.spinnerService.show();
    this.friendsChats_Awaiting = [];

    this._contacts.getFriendChats_Awaiting().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Awaiting =
            this._contacts.friendsChats_Awaiting.items;
        } else {
          this._modalService.showModal(result.message);
        }
      },
      error: (error) => {
        this._modalService.showModal('Wystąpił błąd podczas ładowania oczekujących znajomych.');
        console.error('Error during loading awaiting friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  loadBlockedFriends() {
    console.log('loadBlockedFriends');

    this.spinnerService.show();
    this.friendsChats_Blocked = [];

    this._contacts.getFriendChats_Blocked().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.friendsChats_Blocked = this._contacts.friendsChats_Blocked.items;
        } else {
          this._modalService.showModal(result.message);
        }
      },
      error: (error) => {
        this._modalService.showModal('Wystąpił błąd podczas ładowania zablokowanych znajomych.');
        console.error('Error during loading blocked friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }
}

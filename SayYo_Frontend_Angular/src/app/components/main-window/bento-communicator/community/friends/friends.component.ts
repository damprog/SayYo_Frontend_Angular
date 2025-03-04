import { ContextMenu } from './../../../../../models/model';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import {
  SY_ChatDTO,
  SY_ResponseStatus,
  SY_StrangerDTO,
} from '../../../../../models/dto';
import { ComponentsStateService } from '../../../../../services/components-state.service';
import { ChatService } from '../../../../../services/chat.service';
import { ContextMenuService } from '../../../../../services/context-menu.service';
import { FriendshipService } from '../../../../../services/friendship.service';
import { ModalService } from '../../../../../services/modal.service';
import { AccountService } from '../../../../../services/account.service';
import { finalize, Observable, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent implements OnInit, OnDestroy {
  searchOpen: boolean = false;
  searchPattern: string = '';
  friendsChats_Ok: Array<SY_ChatDTO> = [];
  friendsChats_Awaiting: Array<SY_ChatDTO> = [];
  friendsChats_Blocked: Array<SY_ChatDTO> = [];
  selectedArea: any;

  friendsStatusComp$ = this._stateService.friendsStatus$;

  onRefreshActiveFriends_Subscription!: Subscription;
  onRefreshAwaitingFriends_Subscription!: Subscription;
  onRefreshBlockedFriends_Subscription!: Subscription;

  constructor(
    protected _modalService: ModalService,
    private _accountService: AccountService,
    private _friendshipService: FriendshipService,
    private _contacts: ContactsService,
    private _stateService: ComponentsStateService,
    private _chatService: ChatService,
    private _contextMenuService: ContextMenuService,
    public spinnerService: SpinnerService
  ) {
    this._stateService.friendsStatus$.subscribe((status) => {
      this.selectedArea = status;
    });
  }

  filterChats() {
    if (this.selectedArea.ok) this.loadActiveFriends();
    if (this.selectedArea.invitations) this.loadAwaitingFriends();
    if (this.selectedArea.blocked) this.loadBlockedFriends();
  }

  filterList<T>(
    list: Array<T>,
    searchKey: string,
    property: keyof T
  ): Array<T> {
    if (!searchKey) {
      console.log('return list');
      return list;
    }
    console.log('return filtered');

    return list.filter((item) =>
      (item[property] as unknown as string)
        .toLowerCase()
        .includes(searchKey.toLowerCase())
    );
  }

  showContextMenu(event: MouseEvent, info: SY_ChatDTO): void {
    event.stopPropagation();
    var menuInfo: ContextMenu = {
      name: '',
      menuItems: [],
    };

    if (info.members[0].friendshipStatus === 0) {
      menuInfo = this.prepareAwaitingFriendsMenu(info);
    } else if (info.members[0].friendshipStatus === 1) {
      menuInfo = this.prepareActiveFriendsMenu(info);
    } else if (info.members[0].friendshipStatus === 2) {
      menuInfo = this.prepareBlockedFriendsMenu(info);
    }

    this._contextMenuService.showMenu(event, menuInfo);
  }

  prepareActiveFriendsMenu(info: SY_ChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [
        {
          label: 'Zablokuj',
          action: () =>
            this._friendshipService.updateFriendshipStatus(
              info.members[0].guid,
              2,
              1,
              info.members[0].userBlockedMe
            ),
        },
        {
          label: 'Usuń znajomego',
          action: () =>
            this._modalService
              .confirmPopup(
                `Czy na pewno chcesz usunąć znajomego ${info.members[0].userName}?`
              )
              .pipe(
                switchMap((confirmed) => {
                  if (confirmed) {
                    this._chatService.closeChat_1(info);
                    console.log('Potwierdzono usunięcie znajomego');
                    return this._friendshipService.deleteFriendship(
                      info.members[0].friendshipGuid
                    );
                  } else {
                    console.log('Anulowno usunięcie znajomego');
                    return of(null);
                  }
                })
              ),
        },
      ],
    };
    return menuInfo;
  }

  prepareAwaitingFriendsMenu(info: SY_ChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [],
    };

    if (!info.members[0].iInvited) {
      menuInfo.menuItems.push({
        label: 'Akceptuj',
        action: () =>
          this._friendshipService.updateFriendshipStatus(
            info.members[0].guid,
            1,
            0,
            0
          ),
      });
      menuInfo.menuItems.push({
        label: 'Odrzuć',
        action: () => {
          this._chatService.closeChat_1(info);
          return this._friendshipService.updateFriendshipStatus(
            info.members[0].guid,
            2,
            1,
            info.members[0].userBlockedMe
          );
        },
      });
    } else {
      menuInfo.menuItems.push({
        label: 'Anuluj',
        action: () => {
          this._chatService.closeChat_1(info);
          return this._friendshipService.deleteFriendship(
            info.members[0].friendshipGuid
          );
        },
      });
    }

    return menuInfo;
  }

  prepareBlockedFriendsMenu(info: SY_ChatDTO): ContextMenu {
    var menuInfo: ContextMenu = {
      name: info.chatName,
      menuItems: [],
    };

    if (info.members[0].iBlockedUser) {
      menuInfo.menuItems.push({
        label: 'Odblokuj',
        action: () =>
          this._friendshipService.updateFriendshipStatus(
            info.members[0].guid,
            1,
            0,
            info.members[0].userBlockedMe
          ),
      });
      menuInfo.menuItems.push({
        label: 'Usuń',
        action: () => {
          this._chatService.closeChat_1(info);
          return this._friendshipService.deleteFriendship(
            info.members[0].friendshipGuid
          );
        },
      });
    } else {
      // No options for blocked user
    }

    return menuInfo;
  }

  showChat(targetChat: SY_ChatDTO) {
    console.log(
      'showChat(): ' +
        targetChat.chatGuid +
        ', chatName: ' +
        targetChat.chatName +
        ', friendGuid: ' +
        targetChat.members[0].guid
    );
    this._chatService.showChat(targetChat);
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
    this.filterChats();
  }

  loadActiveFriends() {
    console.log('loadActiveFriends');

    this.spinnerService.show();
    this.friendsChats_Ok = [];

    this._contacts.getFriendChats_Ok().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          console.log('loadActiveFriends result success');

          this.friendsChats_Ok = this._contacts.friendsChats_Ok.items;
          this.friendsChats_Ok = this.filterList(
            this.friendsChats_Ok,
            this.searchPattern,
            'chatName'
          );
        } else {
          console.log('loadActiveFriends result else');

          this._modalService.inform(result.message);
        }
      },
      error: (error) => {
        this._modalService.inform('Wystąpił błąd podczas ładowania znajomych.');
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
          this.friendsChats_Awaiting = this.filterList(
            this.friendsChats_Awaiting,
            this.searchPattern,
            'chatName'
          );
        } else {
          this._modalService.inform(result.message);
        }
      },
      error: (error) => {
        this._modalService.inform(
          'Wystąpił błąd podczas ładowania oczekujących znajomych.'
        );
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
          this.friendsChats_Blocked = this.filterList(
            this.friendsChats_Blocked,
            this.searchPattern,
            'chatName'
          );
        } else {
          this._modalService.inform(result.message);
        }
      },
      error: (error) => {
        this._modalService.inform(
          'Wystąpił błąd podczas ładowania zablokowanych znajomych.'
        );
        console.error('Error during loading blocked friends: ', error);
        this.spinnerService.hide();
      },
      complete: () => {
        this.spinnerService.hide();
      },
    });
  }

  // -------------------
  // modal
  // -------------------

  searchName = '';
  results: Array<SY_StrangerDTO> = [];

  openAddUserModal(template: TemplateRef<any>): void {
    this.searchName = '';
    this.spinnerService.show();

    this._contacts
      .getStrangers(10)
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: (data) => {
          this.results = data;
          console.log('Get strangers: ' + JSON.stringify(data));
          this._modalService.showWithTemplate(template, {
            results: this.results,
          });
        },
        error: (error) => {
          console.error('Wystąpił błąd podczas ładowania strangerów:', error);
        },
      });
  }

  searchUsers(): void {
    var func: () => Observable<Array<SY_StrangerDTO>>;

    if (!this.searchName || this.searchName.trim() === '') {
      func = () => this._contacts.getStrangers(10);
    } else {
      func = () => this._contacts.getStrangersWithFilter(this.searchName);
    }

    this.spinnerService.show();
    func()
      .pipe(finalize(() => this.spinnerService.hide()))
      .subscribe({
        next: (data) => {
          this.results = data;
          this._modalService.showWithTemplate(
            this._modalService.modalComponent.modalTemplate,
            { results: this.results }
          );
        },
        error: (error) => {
          console.error('Wystąpił błąd podczas ładowania strangerów:', error);
        },
      });
  }

  inviteUser(userGuid: string): void {
    this._friendshipService.inviteFriend(userGuid).subscribe(
      () => console.log(`Zaproszono użytkownika o ID: ${userGuid}`),
      (error) => console.error('Błąd podczas zapraszania:', error)
    );

    this._modalService.hideModal();
  }

  // -------------------

  ngOnInit() {
    if (this._accountService.isLoggedIn) {
      this.showFriends_StatusOk();
      // Add subscriptions
      this.onRefreshActiveFriends_Subscription =
        this._contacts.onRefreshActiveFriends.subscribe(() => {
          this.loadActiveFriends();
        });
      this.onRefreshAwaitingFriends_Subscription =
        this._contacts.onRefreshAwaitingFriends.subscribe(() => {
          this.loadAwaitingFriends();
        });
      this.onRefreshBlockedFriends_Subscription =
        this._contacts.onRefreshBlockedFriends.subscribe(() => {
          this.loadBlockedFriends();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.onRefreshActiveFriends_Subscription)
      this.onRefreshActiveFriends_Subscription.unsubscribe();
    if (this.onRefreshAwaitingFriends_Subscription)
      this.onRefreshAwaitingFriends_Subscription.unsubscribe();
    if (this.onRefreshBlockedFriends_Subscription)
      this.onRefreshBlockedFriends_Subscription.unsubscribe();
  }
}

import { finalize, Observable, of, Subscription, switchMap } from 'rxjs';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ContactsService } from '../../../../../services/contacts.service';
import { SpinnerService } from '../../../../../services/spinner.service';
import {
  SY_ChatDTO,
  SY_ChatMemberDTO,
  SY_CreateGroupChatDTO,
  SY_GroupChatMemberDTO,
  SY_ResponseStatus,
} from '../../../../../models/dto';
import { ModalService } from '../../../../../services/modal.service';
import { MembershipService } from '../../../../../services/membership.service';
import { AccountService } from '../../../../../services/account.service';
import { ContextMenuService } from '../../../../../services/context-menu.service';
import { ContextMenu } from '../../../../../models/model';
import { ChatService } from '../../../../../services/chat.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css',
})
export class GroupsComponent implements OnInit, OnDestroy {
  searchOpen: boolean = false;
  searchPattern: string = '';
  groupChats: Array<SY_ChatDTO> = [];
  Object = Object;
  onRefreshGroups_Subscription!: Subscription;

  constructor(
    private _chatService: ChatService,
    private _accountService: AccountService,
    private _contextMenuService: ContextMenuService,
    private _modalService: ModalService,
    private _membershipService: MembershipService,
    private _contacts: ContactsService,
    public spinnerService: SpinnerService
  ) {}

  filterChats() {
    this.loadGroupChats();
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

  showContextMenu(event: MouseEvent, chatInfo: SY_ChatDTO): void {
    event.stopPropagation();
    var menuInfo: ContextMenu = {
      name: '',
      menuItems: [],
    };

    menuInfo = this.prepareGroupMenu(chatInfo);

    this._contextMenuService.showMenu(event, menuInfo);
  }

  prepareGroupMenu(chatInfo: SY_ChatDTO): ContextMenu {
    const accountMember: SY_ChatMemberDTO | undefined = chatInfo.members.find(
      (member) => member.guid == this._accountService.account.userGuid
    );

    // Default items
    var menuInfo: ContextMenu = {
      name: chatInfo.chatName,
      menuItems: [
        {
          label: 'Zobacz członków',
          action: () => {
            this.tempGroupMembers = chatInfo.members;
            return this._modalService.showWithTemplate(
              this.groupMembersModalTemplate,
              {}
            );
          },
        },
        {
          label: 'Opuść grupe',
          action: () =>
            this._modalService
              .confirmPopup(
                `Czy na pewno chcesz opuścić grupę ${chatInfo.chatName}?`
              )
              .pipe(
                switchMap((confirmed) => {
                  if (confirmed && accountMember) {
                    console.log('Potwierdzono opuszczenie grupy');
                    return this._membershipService.deleteChatMember(
                      accountMember.membershipGuid
                    );
                  } else {
                    console.log('Anulowno opuszczenie grupy');
                    return of(null);
                  }
                })
              ),
        },
      ],
    };

    // Admin items
    if (accountMember?.chatRole == 1) {
      menuInfo.menuItems.push({
        label: 'Usuń grupę',
        action: () =>
          this._modalService
            .confirmPopup(
              `Czy na pewno chcesz usunąć grupę ${chatInfo.chatName}?`
            )
            .pipe(
              switchMap((confirmed) => {
                if (confirmed) {
                  console.log('Potwierdzono usunięcie grupy');
                  return this._chatService.deleteChat(chatInfo.chatGuid);
                } else {
                  console.log('Anulowano usuwanie grupy');
                  return of(null);
                }
              })
            ),
      });
    }

    return menuInfo;
  }

  showChat(targetChat: SY_ChatDTO) {
    console.log(
      'showChat(): ' +
        targetChat.chatGuid +
        ', chatName: ' +
        targetChat.chatName
    );
    console.table(targetChat.members);
    this._chatService.showChat(targetChat);
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    this.searchPattern = '';
    this.filterChats();
  }

  loadGroupChats() {
    console.log('loadGroupChats');
    this.spinnerService.show();
    this.groupChats = [];
    this._contacts.getGroupChats().subscribe({
      next: (result: SY_ResponseStatus) => {
        if (result.success) {
          this.groupChats = this._contacts.groupChats.items;
          this.groupChats = this.filterList(
            this.groupChats,
            this.searchPattern,
            'chatName'
          );
        } else {
          this._modalService.showModal(result.message);
        }
      },
      error: (error) => {
        this._modalService.showModal('Wystąpił błąd podczas ładowania czatów.');
        console.error('Error during loading chats: ', error);
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

  @ViewChild('groupMembersModalTemplate')
  groupMembersModalTemplate!: TemplateRef<any>;
  tempGroupMembers: Array<SY_ChatMemberDTO> = [];

  @ViewChild('createGroupModalTemplate')
  createGroupModalTemplate!: TemplateRef<any>;
  filterText: string = '';
  groupName: string = '';
  selectedFriends: { [guid: string]: boolean } = {};
  filteredFriendList: Array<{ userGuid: string; userName: string }> = [];

  openCreateGroupModal(): void {
    // Reset modal
    this.groupName = '';
    this.selectedFriends = {};

    this._modalService.showWithTemplate(this.createGroupModalTemplate, {
      groupName: this.groupName,
      filterText: this.filterText,
      selectedFriends: this.selectedFriends,
      filteredFriendList: this.filteredFriendList,
    });
    this.filterFriends();
  }

  filterFriends() {
    console.log('Group: filtered');
    this.filteredFriendList = this._contacts.friendsChats_Ok.items
      .filter((friendChat) =>
        friendChat.members[0].userName
          .toLowerCase()
          .includes(this.filterText.toLowerCase())
      )
      .map((friendChat) => {
        console.log('Group: filtered map');
        return {
          userGuid: friendChat.members[0].guid,
          userName: friendChat.members[0].userName,
        };
      });
    this._modalService.showWithTemplate(
      this._modalService.modalComponent.modalTemplate,
      {
        groupName: this.groupName,
        filterText: this.filterText,
        selectedFriends: this.selectedFriends,
        filteredFriendList: this.filteredFriendList,
      }
    );
  }

  createGroup(): void {
    // If value is true for key (in this case for guid) return key (key of this dictionary is is guid)
    const selectedGuids = Object.keys(this.selectedFriends).filter(
      (guid) => this.selectedFriends[guid]
    );

    // Map to correct required type
    let selectedMembers: Array<SY_GroupChatMemberDTO> = selectedGuids.map(
      (selectedGuid) => {
        return {
          userGuid: selectedGuid,
          role: 0,
        };
      }
    );

    // Add creator with admin perms
    selectedMembers.push({
      userGuid: this._accountService.account.userGuid,
      role: 1,
    });

    const groupPayload: SY_CreateGroupChatDTO = {
      chatName: this.groupName,
      members: selectedMembers,
    };

    this._chatService
      .createGroup(groupPayload)
      .pipe(
        finalize(() => {
          this._modalService.hideModal();
          // Reset modal
          this.groupName = '';
          this.selectedFriends = {};
        })
      )
      .subscribe({
        next: () => {
          console.log('Grupa została utworzona!');
        },
        error: (error) => {
          console.error('Błąd podczas tworzenia grupy:', error);
        },
      });
  }

  // -----------------------------

  ngOnInit() {
    if (this._accountService.isLoggedIn) {
      this.loadGroupChats();

      // Add subscriptions
      this.onRefreshGroups_Subscription =
        this._contacts.onRefreshGroups.subscribe(() => {
          this.loadGroupChats();
        });
    }
  }

  ngOnDestroy(): void {
    if(this.onRefreshGroups_Subscription){
      this.onRefreshGroups_Subscription.unsubscribe();
    }
  }
}

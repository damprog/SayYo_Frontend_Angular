import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentsStateService {

  constructor() { }

  lastActive:any = {

  };

  public friendsStatusSubject = new BehaviorSubject<any>({
    ok: true,
    invitations: false,
    blocked: false,
  });
  friendsStatus$ = this.friendsStatusSubject.asObservable();

  public communitySubject = new BehaviorSubject<any>({
    account: false,
    friends: true,
    group: false,
  });
  community$ = this.communitySubject.asObservable();

  showFriends_StatusOk() {
    this.friendsStatusSubject.next({ ok: true, invitations: false, blocked: false });
  }

  showFriends_StatusInvitations() {
    this.friendsStatusSubject.next({ ok: false, invitations: true, blocked: false });
  }

  showFriends_StatusBlocked() {
    this.friendsStatusSubject.next({ ok: false, invitations: false, blocked: true });
  }

  showAccount() {
    this.communitySubject.next({ account: true, friends: false, groups: false });
  }

  showFriends() {
    this.communitySubject.next({ account: false, friends: true, groups: false });
  }

  showGroups() {
    this.communitySubject.next({ account: false, friends: false, groups: true });
  }
}

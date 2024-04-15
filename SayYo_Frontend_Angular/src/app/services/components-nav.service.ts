import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComponentsNavService {

  constructor() { }

  community: any = {
    account: false,
    friends: true,
    group: false,
  };

  chatsList: Array<string> = [];

}

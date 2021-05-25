import { IFriend } from '../interfaces/IFriend';

function singleValuePromise<T>(val: T | null): Promise<T | null> {
  return new Promise<T | null>((resolve, reject) => {
    setTimeout(() => resolve(val), 0);
  });
}
function arrayValuePromise<T>(val: Array<T>): Promise<Array<T>> {
  return new Promise<Array<T>>((resolve, reject) => {
    setTimeout(() => resolve(val), 0);
  });
}

class FriendsFacade {
  friends: Array<IFriend> = [
    {
      id: 'id1',
      firstName: 'Peter',
      lastName: 'Pan',
      email: 'pp@b.dk',
      password: 'secret',
    },
    {
      id: 'id2',
      firstName: 'Donald',
      lastName: 'Duck',
      email: 'dd@b.dk',
      password: 'secret',
    },
  ];
  async addFriend(friend: IFriend): Promise<IFriend> {
    friend.id = 'id' + (this.friends.length + 1);
    console.log(friend);
    this.friends.push(friend);
    return friend;
  }

  async deleteFriend(friendEmail: string): Promise<IFriend> {
    let friend: IFriend | null;
    friend = this.friends.find((f) => f.email === friendEmail) || null;
    if (friend === null) {
      throw new Error('Friend not found with email:' + friendEmail);
    }

    const newFriends = this.friends.filter(
      (newFriend) => newFriend.email != friendEmail
    );
    this.friends = newFriends;

    return friend;
  }
  async getAllFriends(): Promise<Array<IFriend>> {
    const f: Array<IFriend> = this.friends;
    return arrayValuePromise<IFriend>(f);
  }
  async getFriend(friendEmail: string): Promise<IFriend | null> {
    let friend: IFriend | null;
    friend = this.friends.find((f) => f.email === friendEmail) || null;
    return singleValuePromise<IFriend>(friend);
  }

  async getFriendById(friendID: string): Promise<IFriend | null> {
    let friend: IFriend | null;
    friend = this.friends.find((f) => f.id === friendID) || null;
    return singleValuePromise<IFriend>(friend);
  }
}

const facade = new FriendsFacade();
export default facade;

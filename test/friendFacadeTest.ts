import * as mongo from 'mongodb';
import FriendFacade from '../src/facades/friendFacade';

import chai from 'chai';
const expect = chai.expect;

//use these two lines for more streamlined tests of promise operations
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import bcryptjs from 'bcryptjs';
import { InMemoryDbConnector } from '../src/config/dbConnector';
import { ApiError } from '../src/errors/errors';

let friendCollection: mongo.Collection;
let facade: FriendFacade;

describe('## Verify the Friends Facade ##', () => {
  before(async function () {
    const client = await InMemoryDbConnector.connect();
    const db = client.db();
    friendCollection = db.collection('friends');
    facade = new FriendFacade(db);
  });

  beforeEach(async () => {
    const hashedPW = await bcryptjs.hash('secret', 4);
    await friendCollection.deleteMany({});
    await friendCollection.insertMany([
      {
        firstName: 'Karl',
        lastName: 'Nielsen',
        email: 'karl@email.com',
        password: hashedPW,
        role: 'user',
      },
      {
        firstName: 'Chris',
        lastName: 'Peder',
        email: 'chris@email.com',
        password: hashedPW,
        role: 'user',
      },
      {
        firstName: 'Oliver',
        lastName: 'Bob',
        email: 'oliver@email.com',
        password: hashedPW,
        role: 'admin',
      },
    ]);
  });

  describe('Verify the addFriend method', () => {
    it('It should Add the user Jan', async () => {
      const newFriend = {
        firstName: 'Jan',
        lastName: 'Olsen',
        email: 'jan@b.dk',
        password: 'secret',
      };
      const status = await facade.addFriend(newFriend);
      expect(status).to.be.not.null;
      const jan = await friendCollection.findOne({ email: 'jan@b.dk' });
      expect(jan.firstName).to.be.equal('Jan');
    });

    it('It should not add a user with a role (validation fails)', async () => {
      const newFriend = {
        firstName: 'Jan',
        lastName: 'Olsen',
        email: 'jan@b.dk',
        password: 'secret',
        role: 'admin',
      };
      try {
        await facade.addFriend(newFriend);
      } catch (error) {
        expect(error instanceof ApiError, 'error is not a ApiError').to.be.true;
      }
    });
  });

  describe('Verify the editFriend method', () => {
    it('It should change lastName to Blibos', async () => {
      const newFriend = {
        firstName: 'Karl',
        lastName: 'Blibos',
        email: 'karl@email.com',
        password: 'Hola',
        role: 'user',
      };

      const modifiedCountObj = await facade.editFriend(
        'karl@email.com',
        newFriend,
        true
      );
      expect(modifiedCountObj.modifiedCount).to.be.equal(1);

      const karl = await friendCollection.findOne({ email: 'karl@email.com' });
      expect(karl.lastName).to.be.equal(newFriend.lastName);
    });
  });

  describe('Verify the deleteFriend method', () => {
    it('It should remove the user Karl', async () => {
      const deleted = await facade.deleteFriend('karl@email.com');

      expect(deleted).to.be.true;
    });

    it('It should throw an Api error, when a user that does not exist', async () => {
      try {
        await facade.deleteFriend('notFound@email.com');
      } catch (error) {
        expect(error instanceof ApiError, 'error is not a ApiError').to.be.true;
        expect(error.message).to.be.equal(
          'No user with email: notFound@email.com'
        );
      }
    });
  });

  describe('Verify the getAllFriends method', () => {
    it('It should get three friends', async () => {
      const friends = await facade.getAllFriends();
      expect(friends.length).to.be.equal(3);
    });
  });

  describe('Verify the getFriend method', () => {
    it('It should find Chris', async () => {
      const chris = await facade.getFriend('chris@email.com');
      expect(chris.lastName).to.be.equal('Peder');
    });
    it('It should not find xxx.@.b.dk', async () => {
      try {
        await facade.getFriend('xxx.@.b.dk');
      } catch (error) {
        expect(error instanceof ApiError, 'error is not a ApiError').to.be.true;
        expect(error.message).to.be.equal('No user with email: xxx.@.b.dk');
      }
    });
  });

  describe('Verify the getVerifiedUser method', () => {
    it("It should correctly validate Oliver's credential,s", async () => {
      const veriefiedPeter = await facade.getVerifiedUser(
        'oliver@email.com',
        'secret'
      );
      expect(veriefiedPeter).to.be.not.null;
    });

    it('It should NOT validate a non-existing users credentials', async () => {
      const veriefiedPeter = await facade.getVerifiedUser(
        'peter@pan.com',
        'secret'
      );
      expect(veriefiedPeter).to.be.equal(null);
    });
  });
});

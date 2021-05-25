import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `

    type Friend {
        id: ID
        firstName: String
        lastName: String
        email: String
        role: String
    }

    """
    Queries available for Friends
    """
     type Query {
        """
        Returns all details for all Friends
        (Requires 'admin' rights)
        """
        getAllFriends : [Friend]!

         """
        Find and returns a friend searching on email
        (Requires 'admin' rights)
        """
        getFriendByEmail(email: String) : Friend!

        """
        Only required if you ALSO wan't to try a version where the result is fetched from the existing endpoint
        """
        getAllFriendsProxy: [Friend]!
        
    }

    input FriendInput {
        firstName: String!
        lastName: String!
        password: String!
        email: String!
    }

    input FriendEditInput {
        firstName: String
        lastName: String
        password: String
        email: String
        role: String
    }

    type Mutation {
        """
        Allows anyone (non authenticated users) to create a new friend
        """
        createFriend(input: FriendInput): Friend

        """
        Allows admins to edit a friend
        """
        editFriend(email: String, input: FriendEditInput): Friend
       
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };

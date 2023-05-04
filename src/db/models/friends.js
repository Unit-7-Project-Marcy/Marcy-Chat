const knex = require('../knex');


class friends {
    static async friendsRequest(user_id,friend_id) {
      try {
        // Check if there is already a pending friend request from the same user_id and friend_id
        const existingRequest = await knex('friends')
            .where({ user_id: user_id, friend_id: friend_id, status: 'pending' })
            .first();

        if (existingRequest) {
            // If there is already a pending friend request, return it
            return existingRequest;
        } else {
            // Otherwise, create a new friend request with status 'pending'
            const query = `INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, 'pending') RETURNING *`
            const friend = await knex.raw(query,[user_id, friend_id])
            return friend.rows[0];
        }
    } catch (err) {
        console.error(err);
        return null;
    }
    }
    static async respondToFriendRequest(user_id, friend_id, status) {
      try {
        // Update the status of the corresponding friend request
        const rowsUpdated = await knex('friends')
            .where({ user_id: user_id, friend_id: friend_id, status: 'pending' })
            .update({ status: status });
        if (rowsUpdated > 0) {
            // If the status was updated, return the updated friend request
            const updatedFriendRequest = await knex('friends')
                .where({ user_id: user_id, friend_id: friend_id })
                .first();

            return updatedFriendRequest;
        } else {
            // If no rows were updated, there was no corresponding friend request to update
            return null;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
    }

    static async listFriends(user_id) {
      try {
          const friends = await knex('friends')
              .select('users.id', 'users.username', 'users.profile_picture')
              .join('users', function() {
                  this.on('friends.friend_id', '=', 'users.id')
                      .orOn('friends.user_id', '=', 'users.id')
              })
              .where(function() {
                  this.where('friends.user_id', '=', user_id)
                      .orWhere('friends.friend_id', '=', user_id)
              })
              .andWhere('friends.status', '=', 'accepted')
              .groupBy('users.id', 'users.username')
              .orderBy('users.username', 'asc');
  
          return friends;
      } catch (err) {
          console.error(err);
          return null;
      }
  }

  static async deleteFriend(user_id,friend_id) {
    try {
        const query = `DELETE FROM friends WHERE user_id = ? AND friend_id = ? RETURNING *`
        const friendDelete = await knex.raw(query,[user_id,friend_id])
        return friendDelete
        }
     catch (err) {
        console.error(err);
        return null;
    }
}

  static async listPending(user_id) {
    try {
        const friends = await knex('friends')
            .select('users.id', 'users.username', 'users.profile_picture')
            .join('users', function() {
                this.on('friends.friend_id', '=', 'users.id')
                    .orOn('friends.user_id', '=', 'users.id')
            })
            .where(function() {
                this.where('friends.user_id', '=', user_id)
                    .orWhere('friends.friend_id', '=', user_id)
            })
            .andWhere('friends.status', '=', 'pending')
            .groupBy('users.id', 'users.username')
            .orderBy('users.username', 'asc');

        return friends;
    } catch (err) {
        console.error(err);
        return null;
    }
}

  static async friendshipStatus(user_id,friend_id) {
    try {
        const query = `SELECT * FROM friends WHERE user_id = ? AND friend_id = ?`
        const friends = await knex.raw(query, [user_id,friend_id])
        return friends.rows
    } catch (err) {
        console.error(err);
        return null;
    }
  }

}

module.exports = friends
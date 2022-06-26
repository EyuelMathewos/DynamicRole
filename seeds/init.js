
exports.seed = async (knex) => {
  await Promise.all([
    knex('articles').del(),
    knex('roles').del(),
    knex('permissions').del(),
    knex('users').del(),
    knex('accesslist').del(),
    knex('accesstokens').del(),

  ]);

  await knex('accesslist').insert([
    { id: 1, name: 'read user', action: 'read', subject: 'users', conditions:{}, fields:[] },
    { id: 2, name: 'create user', action: 'create', subject: 'users', conditions:{}, fields:[] },
    { id: 3, name: 'update user', action: 'update', subject: 'users', conditions:{ id: '${user.id}'}, fields:[] },
    { id: 4, name: 'delete user', action: 'delete', subject: 'users', conditions:{ id: '${user.id}'}, fields:[] },

    { id: 5, name: 'read accesstokens', action: 'read', subject: 'accesstokens', conditions:{}, fields:[] },
    { id: 6, name: 'create accesstokens', action: 'create', subject: 'accesstokens', conditions:{}, fields:[] },
    { id: 7, name: 'update accesstokens', action: 'update', subject: 'accesstokens', conditions:{}, fields:[] },
    { id: 8, name: 'delete accesstokens', action: 'delete', subject: 'accesstokens', conditions:{}, fields:[] },

    { id: 9, name: 'read permissions', action: 'read', subject: 'permissions', conditions:{}, fields:[] },
    { id: 10, name: 'create permissions', action: 'create', subject: 'permissions', conditions:{}, fields:[] },
    { id: 11, name: 'update permissions', action: 'update', subject: 'permissions', conditions:{}, fields:[] },
    { id: 12, name: 'delete permissions', action: 'delete', subject: 'permissions', conditions:{}, fields:[] },

    { id: 13, name: 'read roles', action: 'read', subject: 'roles', conditions:{}, fields:[] },
    { id: 14, name: 'create roles', action: 'create', subject: 'roles', conditions:{}, fields:[] },
    { id: 15, name: 'update roles', action: 'update', subject: 'roles', conditions:{}, fields:[] },
    { id: 16, name: 'delete roles', action: 'delete', subject: 'roles', conditions:{}, fields:[] },

    { id: 17, name: 'read articles', action: 'read', subject: 'articles', conditions:{}, fields:[] },
    { id: 18, name: 'create articles', action: 'create', subject: 'articles', conditions:{}, fields: [] },
    { id: 19, name: 'update articles', action: 'update', subject: 'articles', conditions:{ authorId: '${user.id}'}, fields:[] },
    { id: 20, name: 'delete articles', action: 'delete', subject: 'articles', conditions:{ authorId: '${user.id}'}, fields:[] },

    { id: 21, name: 'read accesslist', action: 'read', subject: 'accesslist', conditions:{}, fields:[] },
    { id: 22, name: 'create accesslist', action: 'create', subject: 'accesslist', conditions:{}, fields:[] },
    { id: 23, name: 'update accesslist', action: 'update', subject: 'accesslist', conditions:{}, fields:[] },
    { id: 24, name: 'delete accesslist', action: 'delete', subject: 'accesslist', conditions:{}, fields:[] },
  ]);

  await knex('roles').insert([
    { id: 1, name: 'admin' },
    { id: 2, name: 'member' },
    { id: 3, name: 'ANONYMOUS_ABILITY' }
  ]);

  await knex('permissions').insert([
    { id: 1, accessId: 1, roleId: 1  },
    { id: 2, accessId: 2, roleId: 1  },
    { id: 3, accessId: 3, roleId: 1  },
    { id: 4, accessId: 4, roleId: 1  },

    { id: 5, accessId: 5, roleId: 1  },
    { id: 6, accessId: 6, roleId: 1  },
    { id: 7, accessId: 7, roleId: 1  },
    { id: 8, accessId: 8, roleId: 1  },

    { id: 9, accessId: 9, roleId: 1  },
    { id: 10, accessId: 10, roleId: 1  },
    { id: 11, accessId: 11, roleId: 1  },
    { id: 12, accessId: 12, roleId: 1  },

    { id: 13, accessId: 13, roleId: 1  },
    { id: 14, accessId: 14, roleId: 1  },
    { id: 15, accessId: 15, roleId: 1  },
    { id: 16, accessId: 16, roleId: 1  },

    { id: 17, accessId: 17, roleId: 1  },
    { id: 18, accessId: 18, roleId: 1  },
    { id: 19, accessId: 19, roleId: 1  },
    { id: 20, accessId: 20, roleId: 1  },

    { id: 21, accessId: 21, roleId: 1  },
    { id: 22, accessId: 22, roleId: 1  },
    { id: 23, accessId: 23, roleId: 1  },
    { id: 24, accessId: 24, roleId: 1  },

    { id: 25, accessId: 1, roleId: 2  },
    { id: 26, accessId: 2, roleId: 2  },
    { id: 27, accessId: 3, roleId: 2  },
    { id: 28, accessId: 4, roleId: 2  },

    { id: 29, accessId: 5, roleId: 2  },
    { id: 30, accessId: 6, roleId: 2  },
    { id: 31, accessId: 7, roleId: 2  },
    { id: 32, accessId: 8, roleId: 2  },

    { id: 33, accessId: 17, roleId: 2  },
    { id: 34, accessId: 18, roleId: 2  },
    { id: 35, accessId: 19, roleId: 2  },
    { id: 36, accessId: 20, roleId: 2  },

    { id: 37, accessId: 2, roleId: 3  },
    { id: 38, accessId: 17, roleId: 3  },

  ]);

  await knex('users').insert([
    { id: 1, email: 'admin@casl.io', password: '$2a$10$610kHDOd83wTjDENcHreQestQ3PtoSsN.0PXg2D5mh74TIcsWXae6', roleId: 1 },
    { id: 2, email: 'author@casl.io', password: '$2a$10$610kHDOd83wTjDENcHreQestQ3PtoSsN.0PXg2D5mh74TIcsWXae6', roleId: 2 },
  ]);

  await knex('articles').insert([
    {
      id: 1,
      title: 'learn agile',
      description: 'learn agile software developer udacity',
      authorId: 1
    },
    {
      id: 2,
      title: 'gitlab and gitlab flow',
      description: 'learn gitlab and gitlab flow',
      authorId: 1
    },
    {
      id: 3,
      title: 'prisma and Knex.js',
      description: 'learn prisma and Knex.js',
      authorId: 2
    },
    {
      id: 4,
      title: 'Casl.js',
      description: 'learn casl.js',
      authorId: 2
    },
    {
      id: 5,
      title: 'Nextjs',
      description: 'learn Nextjs',
      authorId: 1
    },
  ]);


};
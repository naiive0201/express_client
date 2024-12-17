## TODO

[] creating database

```sh
sqlite3 mydb.db
```

[] generate password

```sh
node bcrypt-console.js
```

[] inserting user

```sql
INSERT INTO users(username, password) VALUES ('', '');
```

[] settting SECRET_KEY

### prisma cli

```sh

# prisma ui
npx prisma studio

# migration
npx prisma migrate resolve --applied 0_init
```

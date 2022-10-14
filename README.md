# Requirements

- Node.js 16.13.0
- PostgreSQL 14.1

# Installation

```bash
$ npm install
```

# Running the app

```bash
# local
$ npm run start:local

```

# Stay in touch

- Author - [Erlan Sulaimanov](https://erlansulaimanov.com)
# Database
Запустить код в консоли базы Postgresql

create table orders_book ( id serial primary key, "user" varchar not null, token_a varchar not null, token_b varchar not null, amount_a varchar not null, amount_b varchar not null, amount_left_to_fill varchar not null, is_market boolean default true not null, is_active boolean default true not null, block_number integer not null, transaction_id varchar not null )


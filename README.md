# Introduction
Project BackEnd POS-Coffee-Shop

Build on Express JS

Database MongoDB (NOSQL)

Apply structure MVC - Model View Controller

RESTful API

Deploy on [Vercel](https://vercel.com/)

URL : https://point-of-sale-be.vercel.app/

# Routes
## Index [" / "] : just render text "Point of Sale - API"
## Router for account
  + [GET]   - /acc : Get all account from database
  + [GET]   - /acc/:id : Find account by id
  + [DEL]   - /acc/:id : Delete account by id
  + [POST]  - /acc/login : login by account
  + [POST]  - /acc/register : create new account
  + [PUT]   - /acc/update/:id : Update account by id
  + [PUT]   - /acc/changepw/:id : Update password by id
## Router for dish
  + [GET]   - /dish : Get all dish from database
  + [GET]   - /dish/:id : Find dish by id
  + [DEL]   - /dish/:id : Delete dish by id
  + [POST]  - /dish : Create new dish
  + [PUT]   - /dish/:id : Update dish by id
## Router for history
  + [GET]   - /history : Get all order from database
  + [POST]   - /history/order : Create new order
  + [DEL]  - /history/order/:id : Delete order by id


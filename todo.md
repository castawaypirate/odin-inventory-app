* what we will finish by the end of the day
- update and create forms + styles (almost - something with game_metrics isn't working properly)

* what we learned today
- many middlewares in same route (didn't use it though), you can upsert or update, you have to do most things manually like in many to many you have to delete from the relations table and then insert new (this is one of the methods), method override -> you import you use in app.js with parameter what you are going to use e.g. _method then you write the proper actions in the html form e.g. /update/${gameId}?_put and then you use the correct method in the express router gameRouter.put("update/:gameId", ...), we used put because we send the whole object in the databse layer and we update all the fields (for only one value we would use patch) ~ 11/9/2026 ~

* backlog
- homepage + games page (https://game-library.space/)
- search bar
- game details page (with update and delete options with password)
- side bar with genres, publisher, developer, platform 
- update game form
- cron job that deletes the files that are not in the database but they have been uploaded
- use DELETE, PUT, PATCH methods (use method override)
- research on how to do error handling to the different parts of the application or if there is a universal way to do it
- I may have conflicts when deleting games and I will have to delete other entities connected, then I will need a new page for this, also when deleting a game what about the many to many tables, are those cleaned up from the gameid too?

* done
- database schema
- project basic structure
- create game form
- seed genres, publishers, developers, game engines (and make platforms like or enums)

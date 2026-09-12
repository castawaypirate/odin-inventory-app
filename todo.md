* what we will finish by the end of the day
- delete game entry + cron job  ~ 12/9/2026 ~
- update and create forms + styles (almost - something with game_metrics isn't working properly) ~ 11/9/2026 ~

* what we learned today
- ~ 12/9/2026 ~:
- ~ 11/9/2026 ~:
    - many middlewares in same route (didn't use it though)
    - you can upsert or update
    - you have to do most things manually like in many to many relations you have to delete from the relations table and then insert new (this is one of the methods)
    - method override ---> you import, you use in app.js with parameter what you are going to use e.g. _method then you write the proper actions in the html form e.g. /update/${gameId}?_put and then you use the correct method in the express router gameRouter.put("update/:gameId", ...)
    - we used put because we send the whole object in the databse layer and we update all the fields (for only one value we would use patch)
    - optional({ values: "falsy" })

* backlog
- homepage + games page (https://game-library.space/)
- search bar
- side bar with genres, publisher, developer, platform 
- game details page (with update and delete options with password)
- I may have conflicts when deleting games and I will have to delete other entities connected, then I will need a new page for this, also when deleting a game what about the many to many tables, are those cleaned up from the gameid too?
- cron job that deletes the files that are not in the database but they have been uploaded
- use DELETE, PUT, PATCH methods (use method override)
- add password for create, update and delete games (in a modal in the centre of the screen)
- research on how to do error handling to the different parts of the application or if there is a universal way to do it
- universally handle urls that dont exist
- admin mode for deleting updating all entities (optional)

* done
- database schema
- project basic structure
- create game form
- seed genres, publishers, developers, game engines (and make platforms like or enums)
- update game form

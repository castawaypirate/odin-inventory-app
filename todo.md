# what we will finish by the end of the day
- side bar filters ~ 15/9/2026 ~
- script that may be a cron job and search in the home screen ~ 14/9/2026 ~
- delete game entry (with express-session) + update/create password confirmation for both navigating to the view ~ 13/9/2026 ~
- delete game entry with password confirmation ~ 12/9/2026 ~
- update and create forms + styles (almost - something with game_metrics isn't working properly) ~ 11/9/2026 ~

# what we learned today
- ~ 15/9/2026 ~:
    
- ~ 14/9/2026 ~:
    - node-cron package can execute cron jobs from inside the nodejs project without needing to setup a os level cron job (it is recommended when you use platforms like render for the deployments - use os level cron jobs when you use platforms like digital ocean)
    - GET forms overwrite each other so you need to handle this either by using one big form, either using input with hidden values passing them betweeen two separate forms or handling dynamically with client side js
- ~ 13/9/2026 ~:
    - you have to install express-session, import it and set it up inside app.use(...) based on the documentation
    - to store a value you just do req.session.variable = value
    - the user cannot change the session's object properties and values because the client only have the id of the session - the properties and values are stored in the server (so you can easily do route check after authentication with an if before rendering a view so users cannot navigate wherever without authentication)
    - you can render client side functioning modals by dynamically manipulate them with client side javascript but for them to mix up with functionality you have to do requests to server endpoints and return json instead or html (render and redirect return html)
    - careful with the order or routes because express looks at them from top to bottom and things can get mixed up and on route can take the traffic of another
    - in the middle of express function if you use render or redirect you have to return otherwise the function will keep going (render and redirect do no return or terminate the function)
- ~ 12/9/2026 ~:
    - html forms with get method do not insert values to body, they all go to url
    - to create a pop up either you re-render the whole page along with the modal or you do it with client side javascript
    - to do the password confirmation you either create a form and and a route for the first way or you create a route and you hit it from the client side for the second way
    - to create a modal you have position: fixed; top: 0; left: 0; z-index: 1; width: 100%; height: 100%; and you change the background this takes the whole page and then on top you create the actual modal (modal-content)
- ~ 11/9/2026 ~:
    - many middlewares in same route (didn't use it though)
    - you can upsert or update
    - you have to do most things manually like in many to many relations you have to delete from the relations table and then insert new (this is one of the methods)
    - method override ---> you import, you use in app.js with parameter what you are going to use e.g. _method then you write the proper actions in the html form e.g. /update/${gameId}?_put and then you use the correct method in the express router gameRouter.put("update/:gameId", ...)
    - we used put because we send the whole object in the databse layer and we update all the fields (for only one value we would use patch)
    - optional({ values: "falsy" })

# backlog
- homepage + games page (https://game-library.space/)
- search bar
- side bar with genres, publisher, developer, platform 
- cron job that deletes the files that are not in the database but they have been uploaded
- change ids and fors in the form
- research on how to do error handling to the different parts of the application or if there is a universal way to do it
- universally handle urls that dont exist
- update readme with the setup (what you installed and what configurations you had to make for this to work)
- admin mode for deleting updating all entities (optional)

# done
- database schema
- project basic structure
- create game form
- seed genres, publishers, developers, game engines (and make platforms like or enums)
- update game form
- add password for create, update and delete games (in a modal in the centre of the screen)
- game details page (with update and delete options with password --> we guard the route with express-session we we dont have to put password on create/update button)
- I may have conflicts when deleting games and I will have to delete other entities connected, then I will need a new page for this (the relations are placed in order to not have to delete other entities to delete a game and another view won't be made to delete genres, publishers, developers, game engines and game metrics), also when deleting a game what about the many to many tables, are those cleaned up from the gameid too?
- use DELETE, PUT, PATCH (didn't need patch at the end) methods (use method override)

# odin_ejs_inventory

## DB (CRUD throughout)
- categories
- items

## Guide
1. New ExpressJS project and PostgreSQL database.
2. Define database tables fields, inclusive of relations. For example:

In a game management app, there can be a game, genre, and developer entity. A game can have one or multiple developers and genres. Similarly a developer can develop multiple games.
In a pokemon management app, there can be a pokemon, trainer and a type entity. Each pokemon must be contained in a type. While a trainer can have multiple pokemons.
Any sufficient inventory app will have relations and constraints against its entities. Figure out these database particulars for your inventory app.

3. Set required routes and controllers.
4. Create the ‘READ’ views (i.e. view category, and view item).
5. Create the forms. 
6. Build controllers for CRUD actions.
7. Figure out the delete functionality. 
    - What happens if you try to delete a category with items in it? 
        - Should it delete all the items as well? 
        - Should it just remove the category from the items? 
        - Or something else? 
    - This specific behavior will depend on your app’s requirements.
8. Add dummy data via seed script.
9. Deploy.

## Extra credit

10. Make it pretty!
11. Figure out how to protect destructive actions (like deleting and updating) by making users enter a secret admin password to confirm the action.
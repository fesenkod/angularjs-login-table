# angularjs-login-table

SPA for displaying database with employees in a table view. Supports add new data to database, edit existing data, deletion, sorting and filtering by several fields. Requires authorization before access to table view. It use SHA256 hashing for passwords. If you want to log in in testing mode you should look at file readme.txt where example 10 users are described with actual logins and passwords. 

This spplication uses mock json-server (https://github.com/typicode/json-server).

For start this application:

1) Open console window on your computer.

2) Type in:  npm install -g json-server

3) Go to the directory with the application.

4) Type in: json-server --watch db.json

5) Wait while json-server start.

6) Go in your browser at  http://localhost:3000 to start using application. 

Application uses ng-infinite-scroll to download data from server by chuncks. Scroll at the bottom of the page to display more data in table.

To filter data you should enter some text in inputs at the top of the page and click Filter button.
To edit data you should select ONE raw from the table, then information will be displayed at input fields and you can edit and Save it.
To delete data you should select all raws you want to delete and press Delete button at the bottom of the page.
To add new data you should enter it in empty input fields while there is not 1 (ONE) raw selected in the table.
To sort table by any of 3 fields you should press on desired field at the heading of the table. Next clicks will change order of sorting.

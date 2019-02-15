# Express Render Error Example

There is a small demo (including setting up of a template engine) that you can run with:

```
cd ../
npm install
cd example
npm install
npm start
```

If you get a warning about not being able to install a package, remove your `package-lock.json` file and try again.

You can set the port like this (8000 is the default anyway). This sets `app.locals.option.port` internally:

```
PORT=8000 npm start
```

To add logging too you can use:

```
DEBUG="*" PORT=8000 npm start
```

You can choose just a few selected loggers by comma-separating their names like this:

```
DEBUG="express-render-error,express-render-error:server" PORT=8000 npm start
```

If you visit http://localhost:8000 you should see the 404 page since there are no handles for that path. If you visit http://localhost:8000/throw an error will be thrown which the error handler will catch, log to the debug logger (make sure `DEBUG` is set correctly to see it) and then display a 500 error page for.


## Dev

```
npm run fix
```


## Docker

Docker can't copy files from a parent directory so the `docker:build` command puts the current dev version of express-render-error in this directory and created a modified `package.json.docker`:

```
npm run docker:build && npm run docker:run
```

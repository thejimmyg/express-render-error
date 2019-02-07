# Example

There is a small demo (including setting up of a template engine) that you can run with:

```
DEBUG="express-render-error:server" npm start
```

If you visit http://localhost:8000 you should see the 404 page since there are no handles for that path. If you visit http://localhost:8000/throw an error will be thrown which the error handler will catch, log to the debug logger (make sure `DEBUG` is set correctly to see it) and then display a 500 error page for.

Try setting `DEFAULT_TITLE` to change the title.

## Dev

```
npm run fix
```

## Docker

Currently the main package is linked, install it properly before building docker containers:

```
npm install --save express-render-error
```

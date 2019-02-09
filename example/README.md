# Express Render Error Example

There is a small demo (including setting up of a template engine) that you can run with:

```
DEBUG="express-render-error:server" npm start
```

If you visit http://localhost:8000 you should see the 404 page since there are no handles for that path. If you visit http://localhost:8000/throw an error will be thrown which the error handler will catch, log to the debug logger (make sure `DEBUG` is set correctly to see it) and then display a 500 error page for.

Try setting `DEFAULT_TITLE` to change the title.

To log everything, use:

```
DEBUG="*" PORT=8000 npm start
```


## Dev

```
npm run fix
```

## Docker

Docker can't copy files from a parent directory so the `docker:build` command puts the current dev version of express-render-error in this directory and created a modified `package.json.docker`:

```
npm run docker:build && npm run docker:run
```

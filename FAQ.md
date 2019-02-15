# FAQ

## What is the thinking behind the `app.locals` structure these pacakges are using?

I've found a very useful way to think about building express apps is like this:

* Consider any *object* in `app.locals` as a *namespace*, by which I mean a collection of *configuration* and *helper functions* that do something useful
* Express makes all of these *namespaces* automatically available in your templates, and of course they can be accessed anywhere the `app` object can be, e.g. in `req.app` in request handlers.

Each package provides exported functions that follow a naming convention, and are used like this:

* Prepare any configuration options by parsing environment variables using a `*namespace*OptionsFromEnv()` function.
* Prepare the namespace in `app.locals` by calling a `prepare*Namespace*()` function (where *Namespace* is the same word as used in `app.locals.*namespace*` (but with an uppercase first letter). Pass the options (parsed from the `*namespace *OptionsFromEnv()` function or otherwise) to the `prepare*Namespace*()` function.
* Set up the namespace ready for use, and install any middleware by calling a `setup*Namespace*()` function

A typical app will might use the following namespaces:

* signIn
* theme (implemented by bootstrapOverlay for example)
* mustache
* publicFiles
* option
* debug

Each namespace might build on the others below it.

In this way, you can provide different packages that all work together to create functionality and work together to deliver an express app.

The express-render-error package is a bit unusual in that it provides both the `debug` and the `option` namespaces, as well as an Express Error Handler, and a signal handler, and it has a `prepareErroHandlers()` function. The reason is that pretty much all Express apps need these things set up, so having them all in one package might be helpful.

Other packages should just do one thing.

As examples, `prepareDebug(app)` sets up the `app.locals.debug()` function and `prepareOption(app)` sets up the following under `app.locals.option`:

* scriptName
* port
* sharedPublicUrlPath
* defaultTitle

These have the meanings documented by their corresponding environment variables in the README.md for express-render-error.


## What are the `debug` and `standard` packages in `package.json` and how are they used?

If you look through `package.json` of many of the packages, you'll see the following pacakges used as dependencies:

* `debug` - A package that provides a function for setting up debug loggers. Which messages are printed are controlled using the `DEBUG` environment variable. You can learn more about this here: https://www.npmjs.com/package/debug
* `standard` - Proides a command line utility named `standard` which enforces a farily standard JavaScript style on the source code. When called with the `--fix` flag, it will automatically format code to this style, or output warnings when it can't. The `scripts` part of `package.json` is typically set up to run this when you run `npm run fix`. You can learn more at https://www.npmjs.com/package/standard or https://standardjs.com


## What is mustache and how does it work?

Many of the apps that use express-render-error also use Mustache templates, including the example.

Mustache is a very simple 'logic-less' templating language. There is very little to learn and few features.

The full documentation is available at http://mustache.github.io/mustache.5.html and is worth a read. In particular have a look at the *Non-False Values* and *Partials* sections.

In practice you'll need to know the following syntax:

* `{{>top}}` - include all the mustache from a file named `partials/top.mustache` in one of the mustache overlay directories.
* `{{#option}}{{defaultTitle}}{{/option}}` - render the variable `app.locals.option.defaultTitle`. The `{{#option}}` part means use the keys inside `app.locals.option` until you reach ``{{/option}}`` and the `{{defaulTitle}}` part means use the value associated with the `defaultTitle` key.
* `{{{content}}}` - trust that the variable `content` will never have any harmful HTML in it, and just include it directly. **This is fine for adding trusted HTML to a template, but is unsafe if an untrusted user could potentially add something dangerous to their input.

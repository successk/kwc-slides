# In development

This component is not ready for production use.
It is currently developed and does not exist in bower.
If you want to help us build this component, please sent an PM.

# &lt;kwc-slides&gt;

> Slides system as webcomponent

## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install kwc-slides --save
```

Or [download as ZIP](https://github.com/successk/kwc-slides/archive/master.zip).

## Usage

### 1 – Import polyfill:

```html
<script src="bower_components/webcomponentsjs/webcomponents-lite.min.js"></script>
```

### 2 – Import custom element:

```html
<link rel="import" href="bower_components/kwc-slides/kwc-slides.html">
```

### 3 – Start using it!

*In development*


## Documentation

*In development*

## Development

In order to run it locally you'll need to fetch some dependencies and a basic server setup.

### 1 – Install [bower](http://bower.io/) & [gulp](http://gulpjs.com/):

```sh
$ npm install -g bower gulp
$ npm install gulp
```

### 2 – Install local dependencies:

```sh
$ bower install
$ npm install
```

### 3 – Start development server and open `http://localhost:8000/components/kwc-slides/`.

```sh
$ gulp dev
```

### 4 - build and minify file

```sh
$ gulp build
$ gulp verify # test minified file
```

## History

For detailed changelog, check [Releases](https://github.com/successk/kwc-slides/releases).

## License

MIT
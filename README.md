# Chapter One: Setup

To get started you'll need the following setup

* [NodeJs](https://nodejs.org/) - The tutorial was built in version 22.
* [Angular Cli](https://angular.dev/tools/cli)

[Visual Studio Code](https://code.visualstudio.com/) with the [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) extension is recommended but not required.

So lets run some shell commands. In the directory you want to store your coding projects create the Angular project itself

```bash
$ ng new my-project
```

Angular will ask which CSS pre-parser to use and whether to support Server Side Rendering. To keep the tutorial simple `CSS` was chosen and Server Side rendering is off.

Now let's install Storbook

```bash
$ npx storybook@latest init
```
Storybook will ask if you want to use [Compodoc](https://compodoc.app/) for documentation. Answer `Yes`.

Storybook will launch itself in the browser if everything installed correctly. Play around with it a bit, and in the next chapter we'll test the button events.
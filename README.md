# TiddlyWiki5 Copy on Select

Copy what you are selecting inside the wiki into the clipboard when holding mouse for 1 second

## 动机 Motivation

我已经习惯了用方便的[[Copy On Select|https://addons.mozilla.org/en-US/firefox/addon/copy-on-select]] Firefox 插件，现在到了 TiddlyWiki 里我经常还是以为选中了就复制了，然后黏贴到别的地方才发现其实并没有复制，很不习惯。

所以我自己重新写了一个适配 TiddlyWiki 的选中即复制脚本。

I've gotten used to using the handy [[Copy On Select|https://addons.mozilla.org/en-US/firefox/addon/copy-on-select]] Firefox plugin, but now in TiddlyWiki I often still think I've copied it when I select it, and then I found out that I hadn't copied it until I pasted it somewhere else, which was very uncomfortable.

So I rewrote my own copy-on-selection script for TiddlyWiki.

## 用法 Usage

选中编辑器、按钮等区域以外的任何文本，并保持按住鼠标一秒，就复制选中的内容。

这个插件里的条件语句让它在编辑器等特殊区域内不会起作用，以免干扰「全选黏贴覆盖原有内容」等操作。

Select any text outside the editor, buttons, etc., and hold the mouse down for a second to copy the selected content.

The conditional statement in this plugin makes it not work in special areas like the editor, so as not to interfere with operations like "select all and paste overwrite".

## Development

See [tiddly-gittly/Tiddlywiki-WikiText-Plugin-Template](https://github.com/tiddly-gittly/Tiddlywiki-WikiText-Plugin-Template) for detail.

There are some scripts you can run to boost your development.

After `npm i`:

- `npm run dev` to auto pack the plugin and run a demo site. Your change in the src directory will automatically refresh the site.
- `npm run dev-html` to see demo site with packed plugin after you finish your development, this can be your final check, this runs slower than `npm run dev`

### After the plugin is complete

#### Publish

Enable github action in your repo (in your github repo - setting - action - general) if it is not allowed, and when you tagging a new version `vx.x.x` in a git commit and push, it will automatically publish to the github release.

#### Demo

You will get a Github Pages demo site automatically after publish. If it is 404, you may need to manually enable Github Pages in your github repo:

Settings - Pages (on left side) - Build and deployment- Source - choose `"Github Actions"`

Next time you trigger a publish, the site will be updated. You can see the site link in Settings - Pages

# vue-cli-plugin-svg-loader

[Vue SVG Loader](https://github.com/visualfanatic/vue-svg-loader) Plugin for [vue-cli@3.0](https://github.com/vuejs/vue-cli)

## Install

If you haven't yet installed vue-cli 3, first follow the install instructions here: https://github.com/vuejs/vue-cli

Generate a project

```bash
vue create my-app
```

Install the plugin

```bash
cd my-app
vue add svg-loader
```

Configuration can be done in vue.config.js.

```javascript
module.exports = {
  pluginOptions: {
    svgLoader: {
      svgo: { plugins: [{ removeViewBox: false }, { removeXMLNS: true }] }
    }
  }
};
```

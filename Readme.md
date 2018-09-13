# vue-media-breakpoints

## Features

* Not using Vue's private API.
* Using Passive Event Listeners.
* You can use a custom debouncing function.

## Getting Started

### Install

```sh
npm i @yutahaga/vue-media-breakpoints -S
```

or

```sh
yarn add @yutahaga/vue-media-breakpoints
```

### Usage

```js
import Vue from 'vue';
import { install as MediaBreakPointsPlugin, BreakPoint } from '@yutahaga/vue-media-breakpoints';
import debounce from 'lodash.debounce';

const GRID_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

Vue.use(MediaBreakPointsPlugin, {
  breakPoints: GRID_BREAKPOINTS,
  debounceFunction: debounce,
  debounceFunction: debounce,
  debounceInterval: 30,
});

const vm = new Vue({
  el: '#app',
  template: `
    <div>
      {{ $bp.name }}: {{ $bp.width }}px
    </div>
  `
});

declare module 'vue/types/vue' {
  interface Vue {
    $bp: BreakPoint<typeof GRID_BREAKPOINTS>;
  }
}
```

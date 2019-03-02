# vue-media-breakpoints

## Features

- Not using Vue's private API.
- Using Passive Event Listeners.
- You can use a custom debouncing function.

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
import { install as MediaBreakPointsPlugin, BreakPointManager } from '@yutahaga/vue-media-breakpoints';
import debounce from 'lodash.debounce';
import Vue from 'vue';

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
  debounceInterval: 30,
});

const vm = new Vue({
  el: '#app',
  template: `
    <div>
      <p>{{ $bp.name }}: {{ $bp.width }}px</p>
      <p v-if="$bp.above('sm')">
        This tag is displayed only when the viewport is md ~ xl.
      </p>
      <p v-if="!$bp.below('md', false /* SSR Fallback. Default fallback is true */)">
        This tag is displayed only when the viewport is xs ~ sm.
      </p>
      <p v-if="$bp.equal('lg')">
        This tag is displayed only when the viewport is lg.
      </p>
      <p v-if="$bp.equal(['xs', 'xl'])">
        This tag is displayed only when the viewport is xs and xl.
      </p>
      <p v-if="$bp.between('sm', 'lg')">
        This tag is displayed only when the viewport is between sm and lg. (sm <= ViewPort < lg)
      </p>
      <p v-if="$bp.orAbove('sm')">
        This tag is displayed only when the viewport is sm or above.
      </p>
      <p v-if="$bp.orBelow('sm')">
        This tag is displayed only when the viewport is sm or below.
      </p>
    </div>
  `
});

declare module 'vue/types/vue' {
  interface Vue {
    $bp: BreakPointManager<typeof GRID_BREAKPOINTS>;
  }
}
```

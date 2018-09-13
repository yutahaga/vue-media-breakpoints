import Vue from 'vue';
import { BreakPointManager } from './breakpoint';

declare module 'vue/types/vue' {
  interface Vue {
    $bp: BreakPointManager;
  }
}

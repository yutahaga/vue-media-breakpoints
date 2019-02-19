import { createLocalVue, mount } from '@vue/test-utils';
import debounce from 'lodash.debounce';
import Vue, { CreateElement } from 'vue';

declare var global: any;
declare module 'vue/types/vue' {
  interface Vue {
    $bp: any;
  }
}

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function resizeWindow(localVue: typeof Vue, width: number) {
  global.innerWidth = width;
  global.dispatchEvent(new Event('resize'));

  return localVue.nextTick();
}

test('Basic', async () => {
  global.innerWidth = 320;

  const breakPoints = {
    xs: 0,
    sm: 512,
    md: 768,
    lg: 960
  };

  const { install: Plugin } = await import('../../src/');

  const localVue = createLocalVue();
  localVue.use(Plugin, {
    breakPoints
  });

  const ExampleComponent = {
    name: 'Example',
    render(h: CreateElement) {
      return h('div');
    }
  };

  const wrapper = mount(ExampleComponent, {
    localVue
  });

  expect(wrapper.vm.$bp.name).toBe('xs');
  expect(wrapper.vm.$bp.below('sm')).toBe(true);

  await resizeWindow(localVue, 580);

  expect(wrapper.vm.$bp.name).toBe('sm');
  expect(wrapper.vm.$bp.below('lg')).toBe(true);

  await resizeWindow(localVue, 820);

  expect(wrapper.vm.$bp.name).toBe('md');
  expect(wrapper.vm.$bp.above('lg')).toBe(false);
  expect(wrapper.vm.$bp.above('sm')).toBe(true);
  expect(wrapper.vm.$bp.equal('md')).toBe(true);

  await resizeWindow(localVue, 1280);

  expect(wrapper.vm.$bp.name).toBe('lg');
  expect(wrapper.vm.$bp.equal(['sm', 'lg'])).toBe(true);
});

test('Debounce', async () => {
  jest.resetModules();

  global.innerWidth = 320;

  const breakPoints = {
    xs: 0,
    sm: 512,
    md: 768,
    lg: 960
  };

  const { install: Plugin } = await import('../../src/');

  const localVue = createLocalVue();
  localVue.use(Plugin, {
    breakPoints,
    debounceFunction: debounce,
    debounceInterval: 30
  });

  const ExampleComponent = {
    name: 'Example',
    render(h: CreateElement) {
      return h('div');
    }
  };

  const wrapper = mount(ExampleComponent, {
    localVue
  });

  expect(wrapper.vm.$bp.name).toBe('xs');

  await resizeWindow(localVue, 580);

  expect(wrapper.vm.$bp.name).toBe('xs');

  await sleep(200);

  expect(wrapper.vm.$bp.name).toBe('sm');

  await resizeWindow(localVue, 820);

  expect(wrapper.vm.$bp.name).toBe('sm');

  await sleep(200);

  expect(wrapper.vm.$bp.name).toBe('md');

  await resizeWindow(localVue, 1280);
  await sleep(200);

  expect(wrapper.vm.$bp.name).toBe('lg');
});

/**
 * 用于包裹 App 的 HOC  Redux 组件
 * 为什么要用 HOC 尼？
 * 因为创建 redux 的逻辑是独立的
 * 如果放到 _app.js 里面的话，之后再新增一些别的逻辑代码
 * 那么会导致 _app.js 这个文件的逻辑很复杂，所以用 HOC 将 redux 的逻辑抽离处理
 */
import React from 'react'
import createSore from '../store/store'

// 判断当前环境是否处于服务端
const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  // 服务端需要每次都去新建一个 store
  if (isServer) {
    return createSore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createSore(initialState);
  }
  // 在客户端页面切换时，每次都会调用这个方法，不能每次都去新建一个 store，所以需要缓存一个 store
  return window[__NEXT_REDUX_STORE__];
}

// 因为 Next.js 会给 _app.js 默认导出的 App 组件传递一些属性
// 又因为这里的 HOC 包裹了 App，所以这里的 HOC 也会接收到 Next.js 传递过来的属性
export default AppComp => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      // 为防止每次服务端重新渲染时，都使用同一个 store，需要每次都重新创建一个 store
      // 如果不重新创建 store ，store 中的状态就不会重置，下一次服务端渲染的时候，还会保留上一次的值
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      const { Component, pageProps, ...rest } = this.props;

      return (
        <AppComp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      )
    }
  }

  // 如果这里不需要自定义 getInitialProps 方法的话，需要默认给 HOC 定义一个 getInitialProps 方法
  // 因为 Next.js 在页面渲染之前会去执行一下组件的 getInitialProps
  // WithReduxApp.getInitialProps = AppComp.getInitialProps

  // getInitialProps 方法会在服务端渲染时执行一次，客户端每次页面跳转，也会执行一次
  // 所以在客户端页面切换时，不能每次都去新建一个 store

  // getInitialProps 返回的内容，会被序列化成字符串，写到在服务端返回给客户端的页面中（查看 return.html）
  // 客户端会去读取这个 script 中的字符串内容，然后转换成 JS 对象，最终在客户端生成一个 store


  WithReduxApp.getInitialProps = async ctx => {
    let reduxStore;

    if (isServer) {
      const { req } = ctx.ctx;
      const session = req.session;

      if (session && session.userInfo) {
        // 在服务端渲染时，默认传递用户的数据
        // 当用户输入 url ，浏览器向服务端请求页面时，在服务端渲染时把数据放进去
        // 这样浏览器请求返回的页面中就已经有用户数据了，可以立马显示了
        // 不用像以前一样，浏览器先渲染好一部分内容，然后浏览器发送 ajax 请求去获取用户数据
        // 等待服务器响应完成后，获取数据再去渲染，这其中等待的时间还是挺长的
        reduxStore = getOrCreateStore({
          user: session.userInfo,
        })
      } else {
        reduxStore = getOrCreateStore();
      }
    }
    else {
      reduxStore = getOrCreateStore();
    }

    ctx.reduxStore = reduxStore;

    let appProps = {};
    // 如果 AppComp.getInitialProps 存在
    // 就去获取一下 App 的初始数据
    if (typeof AppComp.getInitialProps === 'function') {
      appProps = await AppComp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      // 这里不能直接返回一个 store
      // 因为 store 里面会有很多方法，在服务端序列化时，很难转成字符串，在客户端又很难反序列化出来
      initialReduxState: reduxStore.getState(),
    }
  };

  return WithReduxApp
}

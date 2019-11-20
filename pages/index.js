import {useEffect} from 'react';
import {Button, Icon, Tabs} from 'antd';
import getCofnig from 'next/config';
import {connect} from 'react-redux';
import Router, {withRouter} from 'next/router';

import Repo from '../components/Repo';
import {cacheArray,getCache} from '../lib/repo-basic-cache';

const api = require('../lib/api');

const {publicRuntimeConfig} = getCofnig();

let cachedUserRepos, cachedUserStaredRepos;

const isServer = typeof window === 'undefined';

function Index({userRepos, userStaredRepos, user, router}) {

    const tabKey = router.query.key || '1';

    const handleTabChange = activeKey => {
        Router.push(`/?key=${activeKey}`);
    };

    useEffect(() => {
        if (!isServer) {
            // 这里对客户端做的数据缓存不大好，一旦 github 的数用户据发生了变化，除非页面刷新，否则无法同步数据
            cachedUserRepos = userRepos;
            cachedUserStaredRepos = userStaredRepos;

            // 所以这里使用 setTimeout 实现缓存更新策略
            setTimeout(() => {
                cachedUserRepos = null;
                cachedUserStaredRepos = null;
            }, 1000 * 60 * 10);

        }
    }, [userRepos, userStaredRepos]);

    useEffect(() => {
        if (!isServer) {
            // 使用 LRU 缓存数据
            cacheArray(userRepos);
            cacheArray(userStaredRepos);
        }
    }, [userRepos, userStaredRepos]);

    if (!user || !user.id) {
        return (
            <div className="root">
                <p>亲，您还没有登录哦~</p>
                <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
                    点击登录
                </Button>
                <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
            </div>
        )
    }

    return (
        <div className="root">
            <div className="user-info">
                <img src={user.avatar_url} alt="user avatar" className="avatar"/>
                <span className="login">{user.login}</span>
                <span className="name">{user.name}</span>
                <span className="bio">{user.bio}</span>
                <p className="email">
                    <Icon type="mail" style={{marginRight: 10}}/>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </p>
            </div>
            <div className="user-repos">
                <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
                    <Tabs.TabPane tab="你的仓库" key="1">
                        {userRepos.map(repo => (
                            <Repo key={repo.id} repo={repo}/>
                        ))}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="你关注的仓库" key="2">
                        {userStaredRepos.map(repo => (
                            <Repo key={repo.id} repo={repo}/>
                        ))}
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
        </div>
    )
}

Index.getInitialProps = async ({ctx, reduxStore}) => {
    // 这段代码在服务端运行时会报错，需要对请求区分处理
    // 因为在客户端运行的时候，浏览器会在 URL 前面加上域名和端口
    // 最终的 URL => http://localhost:3000/github/search/repositories
    // 但是在服务端运行的时候，由于服务端是没有域名的，只有 127.0.0.1 ，并且默认端口是 80
    // 最终的 URL => http://127.0.0.1:80/github/search/repositories ，这个请求会被发送到服务端本地的 80 端口去
    // 80 端口不是最终想要请求的地址，所以会报错
    // const result = await axios
    //   .get('/github/search/repositories')
    //   .then(resp => console.log(resp))

    const user = reduxStore.getState().user;
    if (!user || !user.id) {
        return {
            isLogin: false,
        }
    }

    if (!isServer) {
        if (cachedUserRepos && cachedUserStaredRepos) {
            return {
                userRepos: cachedUserRepos,
                userStaredRepos: cachedUserStaredRepos,
            }
        }
    }

    const userRepos = await api.request(
        {
            url: '/user/repos',
        },
        ctx.req,
        ctx.res,
    );

    const userStaredRepos = await api.request(
        {
            url: '/user/starred',
        },
        ctx.req,
        ctx.res,
    );

    return {
        isLogin: true,
        userRepos: userRepos.data,
        userStaredRepos: userStaredRepos.data,
    }
};

export default withRouter(
    connect(function mapState(state) {
        return {
            user: state.user,
        }
    })(Index),
)

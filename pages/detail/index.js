import dynamic from 'next/dynamic'
import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
import {useEffect} from "react";
import {cache, getCache} from "../../lib/repo-basic-cache";

const MDRenderer = dynamic(() => import('../../components/MarkdownRenderer'));
const isServer = typeof window === 'undefined';

function Detail({readme, full_name}) {
    useEffect(() => {
        if (!isServer) {
            cache(readme,full_name)
        }
    }, [readme,full_name]);
    return <MDRenderer content={readme.content} isBase64={true}/>
}

Detail.getInitialProps = async ({ctx}) => {
    const {
        query: {owner, name},
        req,
        res,
    } = ctx;
    const full_name = `${owner}/${name}/readme`;
    if (getCache(full_name)) {
        return {
            readme: getCache(full_name),
        }
    }
    const readmeResp = await api.request(
        {
            url: `/repos/${full_name}`,
        },
        req,
        res,
    );
    return {
        full_name,
        readme: readmeResp.data,
    }
};

export default withRepoBasic(Detail, 'index')

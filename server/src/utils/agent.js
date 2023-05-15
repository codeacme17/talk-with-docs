import { SocksProxyAgent } from 'socks-proxy-agent'
const agent = new SocksProxyAgent('socks5://127.0.0.1:1086')

const options = {
  httpAgent: agent,
  httpsAgent: agent,
}

export default options

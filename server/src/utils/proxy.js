import { SocksProxyAgent } from 'socks-proxy-agent'
import 'dotenv/config'

console.log(process.env)

let options = {}

if (process.env.SOCKS5_PROXY_ADDRESS) {
  const agent = new SocksProxyAgent(process.env.SOCKS5_PROXY_ADDRESS)
  options = {
    httpAgent: agent,
    httpsAgent: agent,
  }
}

export default options

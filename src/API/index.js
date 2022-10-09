import axios from "axios";

axios.interceptors.request.use((config) => {
  config.url = encodeURI(config.url)
  return config
})

export default axios
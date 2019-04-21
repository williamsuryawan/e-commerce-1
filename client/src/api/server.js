import axios from 'axios'

const server = axios.create({
  baseURL: 'http://35.198.252.114'
})

export default server
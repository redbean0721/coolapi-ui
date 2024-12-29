import axios from "axios";
import { ref } from "vue";

// 创建一个响应式的 version 变量，初始值为 "loading..."
const version = ref("loading...");

// 创建一个函数来加载 API 版本
export async function getApiVersion() {
  try {
    // 使用 async/await 等待 axios 请求完成
    const response = await axios.get("https://api.redmc.xyz/openapi.json");
    
    // 如果请求成功，更新 version 的值
    version.value = response.data.info.version;
  } catch (error) {
    // 错误处理，更新 version 为失败信息
    console.error("Failed to load version: ", error);
    version.value = "Failed to load";
  }
}

export { version };



// import axios from 'axios';

// export async function getApiVersion() {
//   try {
//     const response = await axios.get("https://api.redmc.xyz/openapi.json"); // 替換為你的實際 API 路徑
//     return response.data; // 假設 API 回傳的版本資訊位於 response.data 中
//   } catch (error) {
//     console.error('Failed to fetch API version:', error);
//     throw error; // 拋出錯誤以便呼叫者可以處理
//   }
// }

import { BaseConfig, BaseLogData } from "./index";

// H5日志数据接口
export interface H5LogData extends BaseLogData {
  /** 浏览器名称 */
  browser_name: string;
  /** 浏览器版本 */
  browser_version: string;
  /** 操作系统 */
  os_name: string;
  /** 操作系统版本 */
  os_version: string;
  /** 屏幕宽度 */
  screen_width: string;
  /** 屏幕高度 */
  screen_height: string;
  /** 页面URL */
  page_url: string;
  /** 页面标题 */
  page_title: string;
  /** 页面来源 */
  page_referrer: string;
  /** 网络类型 */
  network_type: string;
}

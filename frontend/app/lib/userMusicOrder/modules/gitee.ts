// import { UserMusicOrderOrigin } from '../common';
// import axios from 'axios';

// export class GiteeUserMusicOrderOrigin implements UserMusicOrderOrigin.Template {
//   // /** 用户名 */
//   // username = 'lvyueyang';
//   // /** gitee 私人令牌 */
//   // password = 'ff27b634a51eaa5b36ddb702ce4a2a1a';
//   // /** 仓库 */
//   // repoName = 'bb-music-order-open';
//   clientID: string = 'b4287587ae0a6d6cb42f181ea2b47619644b4c632489a9a353a54c5a323275ad';
//   clientSecret: string = 'f17eece69198bacfeeeee6a87e7ab0c80f9ff3fa56ee4efb670689681f7079a5';

//   constructor(private config: UserMusicOrderOrigin.Config) {
//     this.auth();
//   }

//   formatPath(path: string) {
//     return `https://gitee.com`;
//   }

//   async auth() {
//     const formData = new FormData();
//     formData.append('grant_type', 'password');
//     formData.append('client_id', this.clientID);
//     formData.append('client_secret', this.clientSecret);
//     formData.append('username', this.config.username);
//     formData.append('password', this.config.password);
//     formData.append('scope', `user_info projects`);

//     const res = await axios.post(
//       'https://gitee.com/oauth/token',
//       {
//         grant_type: 'password',
//         client_id: this.clientID,
//         client_secret: this.clientSecret,
//         username: `975794403@qq.com`,
//         // password: this.config.password,
//         scope: `user_info projects pull_requests issues notes keys hook groups gists enterprises`,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       }
//     );
//     console.log('res: ', res);
//   }
// }

export {};

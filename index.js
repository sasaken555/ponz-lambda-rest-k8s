/**
 * Kubernetesクラスターにデプロイを行うLambda関数
 * index.js
 */

// ライブラリ
const axios = require('axios');

// 定数
const KUBE_BASE_URI = process.env.AWS_K8S_APISERVER;
const KUBE_AUTH_TOKEN = process.env.AWS_K8S_TOKEN;

/**
 * デプロイ関数本体
 * deployK8sDef(event, context, callback)
 * @param {Object} event イベントデータ
 * @param {Object} context ランタイム情報
 * @param {Object} callback コールバック関数
 */
exports.deployK8sDef = (event, context, callback) => {
  // Deploy Code here...
}

// exports.deployK8sDef = (namespace) => {
//   checkApi()
//     .then(getDeployments(namespace));
// }

const axiosInstance = axios.create({
  baseURL: KUBE_BASE_URI,
  headers: {
    'Authorization': `Bearer ${KUBE_AUTH_TOKEN}`
  },
  httpsAgent: new https.Agent({
    'rejectUnauthorized': false
  })
});

/**
 * APIのヘルスチェック
 */
async function checkApi() {
  console.log('Check API...');
  return axiosInstance.get('/api')
          .then((res) => {
            console.log('API Info...');
            console.log(`Status: ${res.status} ${res.statusText}`);
            console.log(JSON.stringify(res.data));
          });
}

/**
 * Deployment一覧を取得する
 * @param {String} namespace 名前空間
 */
async function getDeployments(namespace) {
  console.log('Get Deployment List...');
  return axiosInstance
          .get(`/apis/apps/v1/namespaces/${namespace}/deployments`)
          .then((res) => {
            console.log('Deployment List...');
            console.log(`Status: ${res.status} ${res.statusText}`);

            res.data.items.forEach((deployItem, index, array) => {
              console.log(`Name: ${deployItem.metadata.name}, Desired: ${deployItem.status.replicas}, Available: ${deployItem.status.availableReplicas}`);
            });
          });
}

/**
 * Service一覧を取得する
 * @param {String} namespace 名前空間
 */
function getServices(namespace) {
  // some code here
}

/**
 * Deploymentを作成する
 * @param {String} namespace 名前空間
 * @param {Object} manifest Deployment名
 */
function createDeployment(namespace, manifest) {
  // some code here
}

/**
 * Serviceを作成する
 * @param {String} namespace 名前空間
 * @param {Object} manifest Service名
 */
function createService(namespace, manifest) {
  // some code here
}

/**
 * Deploymentを削除する
 * @param {String} namespace 名前空間
 * @param {String} obj_name Deployment名
 */
function deleteDeployment(namespace, obj_name) {
  // some code here
}

/**
 * Serviceを削除する
 * @param {String} namespace 名前空間
 * @param {String} obj_name Service名
 */
function deleteService(namespace, obj_name) {
  // some code here
}
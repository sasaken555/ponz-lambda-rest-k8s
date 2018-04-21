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
//   // 非同期で実行されるため、順不同で表示される
//   checkApi()
//     .then(getDeployments(namespace))
//     .then(getServices(namespace));
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
  console.log('Get Services List...');
  return axiosInstance
          .get(`/api/v1/namespaces/${namespace}/services`)
          .then((res) => {
            console.log('Services List...');
            console.log(`Status: ${res.status} ${res.statusText}`);

            res.data.items.forEach((serviceItem, index, array) => {
              console.log(`Name: ${serviceItem.metadata.name}, Type: ${serviceItem.spec.type}, PortMappings: port:${serviceItem.spec.ports[0].port}-targetPort:${serviceItem.spec.ports[0].targetPort}`);
            });
          });
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
  console.log('Delete Deployments List...');
  return axiosInstance
          .delete(`/api/v1/namespaces/${namespace}/deployments/${obj_name}`)
          .then((res) => {
            console.log('Deployments List...');
            console.log(`Status: ${res.status} ${res.statusText}`);

            res.data.items.forEach((deployItem, index, array) => {
              console.log(`Name: ${deployItem.metadata.name}, Desired: ${deployItem.status.replicas}, Available: ${deployItem.status.availableReplicas}`);
            });
          });}

/**
 * Serviceを削除する
 * @param {String} namespace 名前空間
 * @param {String} obj_name Service名
 */
function deleteService(namespace, obj_name) {
  console.log('Delete Services List...');
  return axiosInstance
          .delete(`/api/v1/namespaces/${namespace}/services/${obj_name}`)
          .then((res) => {
            console.log('Services List...');
            console.log(`Status: ${res.status} ${res.statusText}`);

            res.data.items.forEach((serviceItem, index, array) => {
              console.log(`Name: ${serviceItem.metadata.name}, Type: ${serviceItem.spec.type}, PortMappings: port:${serviceItem.spec.ports[0].port}-targetPort:${serviceItem.spec.ports[0].targetPort}`);
            });
          });
  }
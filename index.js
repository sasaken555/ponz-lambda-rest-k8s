/**
 * Kubernetesクラスターにデプロイを行うLambda関数
 * index.js
 */

// ライブラリ
const axios = require('axios');
const AWS = require('aws-sdk');
const yaml = require('js-yaml');

// 定数
const KUBE_BASE_URI = process.env.AWS_K8S_APISERVER;
const KUBE_AUTH_TOKEN = process.env.AWS_K8S_TOKEN;
const S3_KUBE_BUCKET = process.env.AWS_KUBE_BUCKET;
const S3_KUBE_REGION = process.env.AWS_KUBE_REGION;
const s3 = new AWS.S3({ params: { Bucket: S3_KUBE_BUCKET, Region: S3_KUBE_REGION } });

/**
 * デプロイ関数本体
 * deployK8sDef(event, context, callback)
 * @param {Object} event イベントデータ
 * @param {Object} context ランタイム情報
 * @param {Object} callback コールバック関数
 */
exports.deployK8sDef = (event, context, callback) => {
  // Deploy Code here...
  checkApi()
  .then(getDeployments(namespace))
  .then(getServices(namespace))
  .then(deleteDeployment(namespace, obj_name))
  .then(deleteService(namespace, obj_name))
  .then(createDeployment(namespace))
  .then(createService(namespace));
}

// exports.deployK8sDef = async (namespace, obj_name) => {
//   // 非同期で実行されるため、順不同で表示される?
//   checkApi()
//     .then(getDeployments(namespace))
//     .then(getServices(namespace))
//     .then(deleteDeployment(namespace, obj_name))
//     .then(deleteService(namespace, obj_name))
//     .then(createDeployment(namespace))
//     .then(createService(namespace));
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
  await axiosInstance.get('/api')
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
  await axiosInstance
          .get(`/apis/apps/v1/namespaces/${namespace}/deployments`)
          .then((res) => {
            console.log('Deployment List...');
            console.log(`Status: ${res.status} ${res.statusText}`);

            if(res.data.items.length == 0) {
              console.log('No resources found.');
            }
            else {
              res.data.items.forEach((deployItem, index, array) => {
                console.log(`Name: ${deployItem.metadata.name}, Desired: ${deployItem.status.replicas}, Available: ${deployItem.status.availableReplicas}`);
              });
            }
        });
}

/**
 * Service一覧を取得する
 * @param {String} namespace 名前空間
 */
async function getServices(namespace) {
  console.log('Get Services List...');
  await axiosInstance
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
 */
function createDeployment(namespace) {
  console.log('Get Deployment Manifest...');
  const params = { Bucket: S3_KUBE_BUCKET, Key: 'sasaken-node-app-deployment.yml' };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
    const manifest = yaml.safeLoad(new Buffer(data.Body).toString('UTF-8'), 'utf8');
    return axiosInstance
            .post(`/apis/apps/v1/namespaces/${namespace}/deployments`, manifest)
            .then((res) => {
              console.log('Create Deployment')
              console.log(`Status: ${res.status} ${res.statusText}`);
              console.log(`${res.data.metadata.name} * ${res.data.spec.replicas} created.`);
            });
  });
}

/**
 * Serviceを作成する
 * @param {String} namespace 名前空間
 */
function createService(namespace) {
  console.log('Get Service Manifest...');
  const params = { Bucket: S3_KUBE_BUCKET, Key: 'sasaken-node-app-service.yml' };
  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    }
    const manifest = yaml.safeLoad(new Buffer(data.Body).toString('UTF-8'), 'utf8');
    return axiosInstance
            .post(`/api/v1/namespaces/${namespace}/services`, manifest)
            .then((res) => {
              console.log('Create Service')
              console.log(`Status: ${res.status} ${res.statusText}`);
            });
  });
}

/**
 * Deploymentを削除する
 * @param {String} namespace 名前空間
 * @param {String} obj_name Deployment名
 */
async function deleteDeployment(namespace, obj_name) {
  console.log('Delete Deployments List...');
  return axiosInstance
          .delete(`/apis/apps/v1/namespaces/${namespace}/deployments/${obj_name}`)
          .then((res) => {
            console.log('Delete Deployments...');
            console.log(`Status: ${res.status} ${res.statusText}`);
          });}

/**
 * Serviceを削除する
 * @param {String} namespace 名前空間
 * @param {String} obj_name Service名
 */
async function deleteService(namespace, obj_name) {
  console.log('Delete Services List...');
  return axiosInstance
          .delete(`/api/v1/namespaces/${namespace}/services/${obj_name}`)
          .then((res) => {
            console.log('Delete Services...');
            console.log(`Status: ${res.status} ${res.statusText}`);
          });
  }
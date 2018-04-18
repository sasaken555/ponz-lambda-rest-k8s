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

/**
 * 登録済みのKubernetesオブジェクトを列挙する
 * @param {String} namespace 
 */
function listExistingK8sObj(namespace) {
  // some code here
}

/**
 * Deployment一覧を取得する
 * @param {String} namespace 
 */
function getDeployments(namespace) {
  // some code here
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
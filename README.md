# Node.jsでLambdaを叩いてKubernetesへリリース

Node.jsからKubernetesのREST APIを叩いてリリースするDemo。

## 使ったAPI

以下のAPIをHTTPクライアント(今回は`axios`)で叩くだけのシンプルな実装。

* クラスタのチェック
  * GET /api
* Deploymentの一覧取得
  * GET /apis/apps/v1/namespaces/${namespace}/deployments
* Servicesの一覧取得
  * GET /api/v1/namespaces/${namespace}/services
* Deploymentの作成
  * POST /apis/apps/v1/namespaces/${namespace}/deployments
* Servicesの作成
  * POST /api/v1/namespaces/${namespace}/services
* Deploymentの削除
  * DELETE /apis/apps/v1/namespaces/${namespace}/deployments/${obj_name}
* Servicesの削除
  * DELETE /api/v1/namespaces/${namespace}/services/${obj_name}

## CodePipelineから叩くときの注意点

参考ページ : [パイプラインでのLambda関数の呼び出す実装](https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/actions-invoke-lambda-function.html)

* Lambdaの実行ロールに特定のポリシーをつけること
  * CloudWatch Logs ... 読み書き全て
  * CodePipeline ... 書き込み

* PutJobSuccessResult/PutJobFailureResultを発行する
  * Lambdaでこの2つを明示的に発行しないと、ジョブは終わってるのにCodePipeline側でタイムアウトする!!

## デプロイ戦略

このリポジトリの例では、一律オブジェクトを削除してから新規にオブジェクトを作成し直している。

### デプロイパターン(参考)

* 全て消してからデプロイ
  * DELETE -> CREATE のパターン

* ローリングアップデートで置き換え
  * (CREATE ->) PATCH or UPDATE のパターン

* カナリアリリース
  * ちょっとだけリリースして、様子をみる。
  * 流量制御で対応する方が現実的かな? デプロイツール側でやる場合は1/3だけUPDATEとかで対応?

* Blue-Green Deployment
  * 新旧両バージョンのコンテナを作成し、切り替えにより新バージョンを後悔する。
  * 毎回Deployment名を別にして(tag名を末尾につけるとか)コンテナを立てる。切り替えはIngressやELBでやっちゃう??

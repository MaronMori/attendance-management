# 勤怠管理アプリケーション
## 公開URL
【https://attendance-management-psi.vercel.app/】
## アプリケーション概要
従業員の勤怠管理を行うアプリケーションで、出勤、休憩、退勤と合計労働時間がわかります。
## テスト用のアカウント
メールアドレス：q80jdo8rc9@sute.jp  
パスワード：password123
## 注意点
もしロードが終わらない場合、一度ログアウトしていただいて、もう一度ログインすると直ります。
## 使用した技術・ライブラリとなぜ使用したか
### React
Webアプリケーションを作成する際に世界で最も使用されているライブラリのため使用しました。また動的なアプリケーションの作成をしたかったので、JavaScriptで使用できるReactにしました。
### Next.js
Reactで作成したアプリケーションを簡単にページレンダリングさせることができるため使用しました。ReactをUdemyで学んだ時に同時に学習したのもきっかけです。
### Firebase
ユーザー認証の際に使用しました  
今までの個人開発で使用した経験があるのと、比較的簡単に実装できるためFirebaseを利用しました。
### Firestore
ユーザーの名前を登録する際に使用しました。名前だけを保存するのでFirebaseのユーザーIDと連携しやすいのでMySQLではなくFirestoreを使用しました。
### MySQL
ユーザーの出勤情報をMySQLで管理しています。
MySQLを使用した理由は、今までSQLを本格的に使用したことがなかったので、この機会に学習という意味合いで使用しました。
### AWS RDS
アプリケーションをデプロイして公開するので、AWS RDSでMySQLのデータベースを作成しました。　　
AWSが広く使用されていて、学びたいと今まで思っていたのも理由です。
### Tailwind
CSSを簡単にさせるために使用しています。   
Material UIとの併用の際に適応されない時があるのでそこで少し苦戦しました。
### Material UI
デザインを統一かさせてモダンなデザインにさせるために使用しました。
## こだわったところ
ユーザーが出勤や退勤ボタンを押したら、動的に出勤表がアップデートされるところです。　  
またロード中にMUIのコンポーネントで視覚的にわかりやすくロードしていることを知らせるのもこだわりました。
## 難しかったところ
開発環境ではMySQLにアクセスできたのですが、buildして本番環境だと全くアクセスできなかったところにつまづきました。   
対処法として、エラーをそのまま検索にかけたら英語で同じようなエラーについてのページがあったのでそれを参考に修正しました。   
具体的な修正は、web packのデフォルトの設定でbuildする時にコードを最小化するのでasyncやawaitなどがうまく機能していない？のようなことでした。
なのでweb packの設定でminimizeをfalseにしたら直りました。
## 今後の課題
このアプリケーションを使用する企業に合わせて、管理者用のアカウント作成機能を追加し、従業員が出勤などを間違えた時に修正できるようにしたいです。   
今回のケースでは管理者アカウントが誰でも作成してしまうのを防ぐために、実装しませんでした。

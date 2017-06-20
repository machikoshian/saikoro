* 使用済み memcache/matching データの削除。
* 給料のイベントのタイミング
* 建設時にカードとクリックエリアが消えない。
* 選択がなくてもキャラカードボタンが押せるタイミングがある。
* size=2 施設を上書きするとアニメーションがおかしくなる。
* HybridConnection の機能を Client に移す

* dice1, dice2 を配列に
* 使っていない tsconfig-es6.json の削除
* event.target_card_ids を event.buildFacility でも使う。
* html_view.ts のリファクタリング
* 観戦モードの追加
* 各イベントの同期
* タイムアウトの実装
* abstract View クラスの作成
* Card owner の変更への対応
* NO_PLAYER (= -1) const value の実装
* console.log 等の、開発モードとの挙動の切り替え
* ユニットテストの追加
* process handler chain / state hook の作成
* Dice roll への狙い目の UI 対応
* イベントログに step 数を足す。
* マッチング機能の書き直し
* class と CSS を明示的に分類。
* 赤の評価順をプレーヤーから左回りに変更。
* Firebase.onDisconnect への対応
* 施設データを JSON で管理
* html table から div への移行

* cocos2d-js のチュートリアル
* IE11 への対応 (polyfill for promise)

# やらない?
* websocket のサポート
* 複数インスタンスへの対応

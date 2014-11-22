Ardrone2014
===========
ドローンゼミのソース共有をします．

#Wiki
Node.jsのインストールやARDrone連携のwikiを作りました．  
開発でハマったとこなど，Tipsを共有しましょう！  
http://wired.cyber.t.u-tokyo.ac.jp/~m_okada/pukiwiki/

#開発方針
##基本
それぞれgitでブランチを作って作業しましょう．  
いろいろ考慮した結果，oculus-drone-masterをベースをするのが最も速そうです．  
メインはswarm.jsの書き換え，場合によってindex.jsやpublic/client.jsを書き換え．  

##デバッグ方法
oculus-drone-masterでは，キーボード操縦が可能になっている．  
oculus未接続でも，Firefoxでlocalhost:3000にアクセスすると以下の操作ができる．  

* Enter: 離陸
* Esc: 着陸
* W: 上昇
* S: 下降
* A: 左回転
* D: 右回転
* 矢印キー：それぞれの方向へ進む

最初にEnterで離陸させ，プログラムを試して危なくなったらEscで着陸orキーボード操作で回避するとよい．

##便利な設定
* gitのコミットグラフをターミナル上で可視化するコマンドを設定する  
`$ git config --global alias.tree 'log --graph --all --format="%x09%C(cyan bold)%an%Creset%x09%C(yellow)%h%Creset %C(magenta reverse)%d%Creset %s"'`  
これを設定しておくと，`$ git tree` と打つことでグラフが見れるようになる．出たいときはqを押す．

#Tips
* インストール関連：  
nvm install v0.10.33 use v0.10.33とする。（そうしないと、npm install opencvが失敗する）
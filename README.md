Ardrone2014
===========
ドローンゼミのソース共有をします．

#Wiki
Node.jsのインストールやARDrone連携のwikiを作りました．  
開発でハマったとこなど，Tipsを共有しましょう！  
http://wired.cyber.t.u-tokyo.ac.jp/~m_okada/pukiwiki/

#Git開発
##開発方針
検討中  
masterブランチで作業する or それぞれでブランチを切って作業する

##便利な設定
* gitのコミットグラフをターミナル上で可視化するコマンドを設定する  
`$ git config --global alias.tree 'log --graph --all --format="%x09%C(cyan bold)%an%Creset%x09%C(yellow)%h%Creset %C(magenta reverse)%d%Creset %s"'`  
これを設定しておくと，`$ git tree` と打つことでグラフが見れるようになる．出たいときはqを押す．

#Tips
* インストール関連：  
nvm install v0.10.33 use v0.10.33とする。（そうしないと、npm install opencvが失敗する）

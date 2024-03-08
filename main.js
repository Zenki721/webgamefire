 const elementColors = {
     'リチウム': '赤色',
     'ナトリウム': '黄色',
     'カリウム': '紫色',
     '銅': '緑色',
     'カルシウム': '橙色',
     'ストロンチウム': '紅色',
     'バリウム': '黄緑色',
 };
 const userHand = [];
 let attempts = 0;
 let correctAnswers = 0;
 let userHealth = '♥♥♥';
 let enemyHP = '♥♥♥♥';
 const maxAttempts = 6;
 const maxTurns = 6;
 const requiredCorrectAnswers = 4;
 const turnCountElement = $('#turn-count');
 const userHealthElement = $('#user-health');
 const enemyHPElement = $('#enemy-hp');
 //手札を配る関数
 function dealCards() {
     const enemyColor = Object.values(elementColors)[Math.floor(Math.random() * Object.values(elementColors).length)];
     $('#enemy-color-display').text(enemyColor);//敵の色をランダムで設定
     userHand.length = 0;//手札の初期化
     userHand.push(Object.keys(elementColors).find(card => elementColors[card] === enemyColor));// 必ず敵の色と一致するカードを手札に含めます
     const elementNames = Object.keys(elementColors);
     for (let i = 1; i < 5; i++) {// 4枚の残りのカードをランダムに選び、手札に追加
         let randomElement;
         do {
             randomElement = elementNames[Math.floor(Math.random() * elementNames.length)];
         } while (userHand.includes(randomElement));
         userHand.push(randomElement);
     }
     shuffle(userHand);//解答札を入れて再度混ぜる
     //敵画像表示
     if (enemyColor === "赤色") {
         $(".enemy_red").css("display", "block");
     } else if (enemyColor === "黄色") {
         $(".enemy_yellow").css("display", "block");
     } else if (enemyColor === "紫色") {
         $(".enemy_purple").css("display", "block");
     } else if (enemyColor === "緑色") {
         $(".enemy_green").css("display", "block");
     } else if (enemyColor === "橙色") {
         $(".enemy_orange").css("display", "block");
     } else if (enemyColor === "紅色") {
         $(".enemy_deepred").css("display", "block");
     } else {
         $(".enemy_greenyellow").css("display", "block");//黄緑色
     }
 }
 //シャッフル関数
 function shuffle(array) {
     for (let i = array.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [array[i], array[j]] = [array[j], array[i]];
     }
 }
 function enemyChallenge() {
     const enemyColor = $('#enemy-color-display').text();
     const userCards = $('#user-cards');
     userCards.empty();
     for (const cardElement of userHand) {
         const cardAttack = 1;
         const li = $('<li></li>');//手札をリスト表示
         li.text(cardElement);// カードのテキストを元素名に設定
         li.on('click', () => checkMatch(cardElement, enemyColor, cardAttack));//cardにclickイベントを付与している.off()で最後に排除するケアをしてある/*修正できなかった箇所*/
         userCards.append(li);
     }
     attempts++;//ターンカウント加算
     turnCountElement.text(attempts);//ターンの更新
     updateUserHealth();
     if (attempts >= maxTurns || userHealth === '' || enemyHP === '' || enemyHP <= 0) {
         trans_Result();// ゲーム終了条件をチェック
     }
 }
 function checkMatch(cardColor, enemyColor, cardAttack) {
   
     const elementColor = elementColors[cardColor];// カードの色を取得
     if (elementColor === enemyColor) {//正誤判定
         correctAnswers++;//正解数の加算
         enemyHP = enemyHP.slice(0, -1);// カードの攻撃力分、敵のHPを減少
         enemyHPElement.text(enemyHP);
         $("#maru").css("display", "block");
     }
     else {
         const correctElement = Object.keys(elementColors).find(element => elementColors[element] === enemyColor);//正解の元素を検索
         $("#batsu").css("display", "block");
         $("#incorrect-message").text(`正解は「${correctElement}」でした。`).css("display","block");//正解表示
     }
     userHand.splice(userHand.indexOf(cardColor), 1);// カードを削除
     $("#next").css("display", "block");
     $('li').off('click');// li要素のクリックイベントを削除
     
 }
 //ユーザーの体力管理
 function updateUserHealth() {
     if (attempts > 1 && attempts % 2 === 0 && userHealth.length > 0) {// 2ターンごとに体力を減少
         userHealth = userHealth.slice(0, -1); // 最後のハートを削除
         userHealthElement.text(userHealth);// 体力を更新
     }
 }
 //結果表示
 function showResult() {
     const resultMessage = $('#result-message');//メッセージを指定
     //正解数で分岐
     if (correctAnswers < 4) {
         resultMessage.text('あなたは怪獣に倒されてしまった。。。');
         $("#lose").css("display", "block");
     } else {
         resultMessage.text('怪獣を倒したよ！！！すごい！！');
         $("#win").css("display", "block");
     }
     $("#reset").css("display", "block");
 }
 $(function () {
     trans_Title();
 })
 $("#start").on("click", function () {
     dealCards();
     enemyChallenge();
     trans_Battle();
 });
 $("#rule").on("click", function () {
     trans_Rule();//ルール説明画面表示
     $('.go_title').on("click", function () {
         trans_Title();
     });//タイトルへ戻る
 });
 $("#next").on("click", function () {
     trans_Next();
     //５ターン経過したかの確認
     if (attempts < maxAttempts && correctAnswers < requiredCorrectAnswers) {
         dealCards();
         enemyChallenge();
     } else {
         trans_Result();
     }
 });
 $("#reset").on("click", function () {
     //初期化してタイトル画面へ
     attempts = 0;
     correctAnswers = 0;
     userHealth = '♥♥♥';
     enemyHP = '♥♥♥♥';
     $('#user-health').text(userHealth);
     $('#enemy-hp').text(enemyHP);
     $("#lose").css("display", "none");
     $("#win").css("display", "none");
     trans_Next();
     trans_Title();
 })
 //画面遷移用
 function trans_Title() {
     $('#img0').css('display', 'block');
     $('.title_page').css('display', 'block');
     $('.rule_page').css('display', 'none');
     $('.game_page').css('display', 'none');
     $('.result_page').css('display', 'none');
 }
 function trans_Rule() {
     $('.title_page').css('display', 'none');
     $('.rule_page').css('display', 'block');
     $('.game_page').css('display', 'none');
     $('.result_page').css('display', 'none');
 }
 function trans_Battle() {
     $('.title_page').css('display', 'none');
     $('.rule_page').css('display', 'none');
     $('.game_page').css('display', 'block');
     $('.result_page').css('display', 'none');
 }
 function trans_Next(){
     $("#maru").css("display", "none");
     $("#batsu").css("display", "none");
     $("#next").css("display", "none");
     $("#incorrect-message").css("display", "none");
     $(".enemy_red").css("display", "none");
     $(".enemy_yellow").css("display", "none");
     $(".enemy_purple").css("display", "none");
     $(".enemy_green").css("display", "none");
     $(".enemy_orange").css("display", "none");
     $(".enemy_deepred").css("display", "none");
     $(".enemy_greenyellow").css("display", "none");
 }
 function trans_Result() {
     $('.title_page').css('display', 'none');
     $('.rule_page').css('display', 'none');
     $('.game_page').css('display', 'none');
     $('.result_page').css('display', 'block');
     showResult()
 }

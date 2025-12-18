document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('wordInput');
    const explainButton = document.getElementById('explainButton');
    const explanationDiv = document.getElementById('explanation');
    const loadingDiv = document.getElementById('loading');

    // ★ここにあなたのGemini APIキーを貼り付けてください★
    const GEMINI_API_KEY = 'AIzaSyAsaCKHeU_F_PWxt4blZ2IAv8Ii5IoVPws'; // 例: 'AIzaSyC...'

    async function explainWord() {
        const word = wordInput.value.trim();
        if (!word) {
            explanationDiv.textContent = '単語を入力してください。';
            return;
        }

        explanationDiv.innerHTML = ''; // 前回の結果をクリア
        loadingDiv.style.display = 'block'; // ローディング表示

        try {
            // Geminiへのプロンプトを定義
            const prompt = `「${word}」とは`;

            // Gemini APIへのリクエストを送信
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            // レスポンスのチェック
            if (!response.ok) {
                const errorData = await response.json();
                // エラーの詳細をコンソールに出力し、ユーザーには一般的なメッセージを表示
                console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
                throw new Error(`API呼び出しに失敗しました。詳細: ${errorData.error ? errorData.error.message : response.statusText}`);
            }

            const data = await response.json();

            // Geminiからの応答が期待通りの形式か確認
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                const explanation = data.candidates[0].content.parts[0].text;
                explanationDiv.innerHTML = formatText(explanation);
            } else {
                explanationDiv.textContent = '解説を取得できませんでした。別の単語を試すか、APIの応答形式を確認してください。';
                console.warn('Unexpected API response format:', data);
            }

        } catch (error) {
            console.error('Error explaining word:', error);
            explanationDiv.textContent = `解説中にエラーが発生しました。\nAPIキーが正しいか、ネットワーク接続を確認してください。\nエラー: ${error.message}`;
        } finally {
            loadingDiv.style.display = 'none'; // ローディング非表示
        }
    }

    function formatText(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    explainButton.addEventListener('click', explainWord);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            explainWord();
        }
    });
});
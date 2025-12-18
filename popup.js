document.addEventListener('DOMContentLoaded', function() {
    const wordInput = document.getElementById('wordInput');
    const explainButton = document.getElementById('explainButton');
    const explanationDiv = document.getElementById('explanation');
    const loadingDiv = document.getElementById('loading');

    // ★ここにあなたのGemini APIキーを貼り付けてください★
    const GEMINI_API_KEY = 'your-key'; 
    
    // Rate limiting
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 2000; // 2秒間隔

    async function explainWord() {
        const word = wordInput.value.trim();
        if (!word) {
            explanationDiv.textContent = '単語を入力してください。';
            return;
        }

        // Rate limiting check
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
            const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
            explanationDiv.textContent = `リクエスト制限のため${Math.ceil(waitTime/1000)}秒お待ちください...`;
            setTimeout(() => explainWord(), waitTime);
            return;
        }
        lastRequestTime = now;

        explanationDiv.innerHTML = ''; // 前回の結果をクリア
        loadingDiv.style.display = 'block'; // ローディング表示

        try {
            // Geminiへのプロンプトを定義
            const prompt = `「${word}」とは`;

            // Gemini APIへのリクエストを送信
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
                console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
                
                // Handle specific quota/limit errors
                if (response.status === 429 || (errorData.error && errorData.error.message && errorData.error.message.includes('quota'))) {
                    throw new Error('API使用量の上限に達しました。しばらく時間をおいてから再度お試しください。');
                }
                
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

    // Add quota check function
    async function checkQuota() {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
            if (response.ok) {
                explanationDiv.innerHTML = '<strong>API接続OK:</strong> クォータに問題はありません。';
            } else {
                const errorData = await response.json();
                explanationDiv.innerHTML = `<strong>API状態:</strong> ${errorData.error?.message || 'エラーが発生しました'}`;
            }
        } catch (error) {
            explanationDiv.innerHTML = `<strong>接続エラー:</strong> ${error.message}`;
        }
    }

    explainButton.addEventListener('click', explainWord);
    wordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            explainWord();
        }
    });
    
    // Add double-click to check quota
    explainButton.addEventListener('dblclick', checkQuota);
});

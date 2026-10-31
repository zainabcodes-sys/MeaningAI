
const analyzeBtn = document.getElementById("analyzeBtn");
const sentenceInput = document.getElementById("sentence");
const results = document.getElementById("results");

analyzeBtn.addEventListener("click", async () => {
    const sentence = sentenceInput.value.trim();

    if (!sentence) {
        results.textContent = "Please enter a sentence first.";
        return;
    }

    results.textContent = "Analyzing sentence...";
    analyzeBtn.disabled = true;

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ sentence })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed");
        }

        // Clear previous results
        results.replaceChildren();

        // Intent card
        const intentCard = document.createElement("div");
        intentCard.className = "analysis-card";
        const intentTitle = document.createElement("h3");
        intentTitle.textContent = "🎯 Detected Intent";
        const intentValue = document.createElement("p");
        intentValue.textContent = data.intent;
        intentCard.append(intentTitle, intentValue);

        // Entities card
        const entityCard = document.createElement("div");
        entityCard.className = "analysis-card";
        const entityTitle = document.createElement("h3");
        entityTitle.textContent = "🔍 Extracted Entities";
        entityCard.appendChild(entityTitle);

        const entries = Object.entries(data.entities);

        if (entries.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No entities detected";
            entityCard.appendChild(empty);
        }

        entries.forEach(([key, value]) => {
            const tag = document.createElement("span");
            tag.className = "entity-tag";
            tag.textContent = `${key}: ${value}`;
            entityCard.appendChild(tag);
        });

        // Tokenization card
        const tokenCard = document.createElement("div");
        tokenCard.className = "analysis-card";
        const tokenTitle = document.createElement("h3");
        tokenTitle.textContent = "🧩 Tokenization";
        tokenCard.appendChild(tokenTitle);

        data.tokens.forEach(token => {
            const tag = document.createElement("span");
            tag.className = "token-tag";
            tag.textContent = token;
            tokenCard.appendChild(tag);
        });

        // Semantic representation card
        const meaningCard = document.createElement("div");
        meaningCard.className = "analysis-card";
        const meaningTitle = document.createElement("h3");
        meaningTitle.textContent = "🧠 Meaning Representation";
        const jsonOutput = document.createElement("pre");
        jsonOutput.textContent = JSON.stringify(
            data.meaning_representation, null, 2
        );
        meaningCard.append(meaningTitle, jsonOutput);

        // Meaning Explanation card
        const explanationCard = document.createElement("div");
        explanationCard.className = "analysis-card";

        const explanationTitle = document.createElement("h3");
        explanationTitle.textContent = "💡 Meaning Explanation";

        const explanationText = document.createElement("p");
        explanationText.textContent = data.explanation;

        explanationCard.append(explanationTitle, explanationText);

        results.append(
            intentCard,
            entityCard,
            tokenCard,
            meaningCard,
            explanationCard
        );

    } catch (error) {
        results.textContent = "Error: " + error.message;
    } finally {
        analyzeBtn.disabled = false;
    }
});

const historyBtn = document.getElementById("historyBtn");
const historyResults = document.getElementById("historyResults");

historyBtn.addEventListener("click", async function () {
    historyResults.textContent = "Loading analysis history...";
    historyBtn.disabled = true;

    try {
        const response = await fetch("/history");

        if (!response.ok) {
            throw new Error("Could not load history.");
        }

        const history = await response.json();
        historyResults.replaceChildren();

        if (history.length === 0) {
            historyResults.textContent = "No analysis history yet.";
            return;
        }

        history.forEach(item => {
            const card = document.createElement("div");
            card.className = "history-card";

            const sentence = document.createElement("h3");
            sentence.textContent = item.sentence;

            const intent = document.createElement("p");
            intent.textContent = "🎯 Intent: " + item.intent;

            const entities = document.createElement("p");
            entities.textContent =
                "🔍 Entities: " + JSON.stringify(item.entities);

            const date = document.createElement("small");
            date.textContent = "🕒 " + item.created_at + " UTC";

            card.append(sentence, intent, entities, date);
            historyResults.appendChild(card);
        });

    } catch (error) {
        historyResults.textContent = "Error: " + error.message;
    } finally {
        historyBtn.disabled = false;
    }
});

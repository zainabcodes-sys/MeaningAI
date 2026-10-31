
from flask import Flask, render_template, request, jsonify
from nlp_engine import analyze_sentence
from database import init_db, save_analysis, get_history

app = Flask(__name__)

init_db()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json(silent=True) or {}
    sentence = data.get("sentence", "")

    if not isinstance(sentence, str) or not sentence.strip():
        return jsonify({
            "error": "Please enter a sentence."
        }), 400

    if len(sentence) > 1000:
        return jsonify({
            "error": "Sentence is too long."
        }), 400

    result = analyze_sentence(sentence)

    save_analysis(result)

    return jsonify(result)


@app.route("/history", methods=["GET"])
def history():
    return jsonify(get_history())


if __name__ == "__main__":
    app.run(debug=True)

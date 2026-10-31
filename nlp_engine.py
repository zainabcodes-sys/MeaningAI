
import re

SUBJECTS = {
    "python": "Python",
    "java": "Java",
    "mathematics": "Mathematics",
    "maths": "Mathematics",
    "nlp": "NLP",
    "natural language processing": "NLP"
}

DAYS = [
    "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday", "sunday"
]


def analyze_sentence(sentence):
    text = sentence.lower()
    tokens = re.findall(r"\b\w+\b", text)

    # Step 1: Intent detection
    if any(word in tokens for word in [
        "teacher", "teachers", "teaches",
        "faculty", "professor", "instructor"
    ]):
        intent = "find_faculty"

    elif any(word in tokens for word in [
        "schedule", "timetable", "class", "classes",
        "timing", "when"
    ]):
        intent = "find_schedule"

    elif any(word in tokens for word in [
        "course", "courses", "subject", "subjects",
        "study", "learn"
    ]):
        intent = "find_course"

    else:
        intent = "unknown"

    # Step 2: Entity extraction
    entities = {}

    for keyword, subject in SUBJECTS.items():
        if re.search(r"\b" + re.escape(keyword) + r"\b", text):
            entities["subject"] = subject
            break

    for day in DAYS:
        if day in tokens:
            entities["day"] = day.capitalize()
            break

    # Step 3: Meaning explanation
    if intent == "find_faculty":
        explanation = "The user is asking about a faculty member."

    elif intent == "find_schedule":
        explanation = "The user wants information about a class schedule."

    elif intent == "find_course":
        explanation = "The user is searching for course information."

    else:
        explanation = "The sentence does not match a known intent."

    # Step 4: Structured meaning representation
    meaning_representation = {
        "intent": intent,
        "entities": entities
    }

    return {
        "sentence": sentence,
        "tokens": tokens,
        "intent": intent,
        "entities": entities,
        "explanation": explanation,
        "meaning_representation": meaning_representation
    }

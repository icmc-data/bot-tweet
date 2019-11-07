from flask import Flask, jsonify, request, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Defining CORS for the localhost domain...


"""
    Responsible for defining the only method of the api.
    This will make the predictions possible by serving a tensorflow instance.
"""
@app.route('/', methods=['POST'])
def predict():
    # In case our request.json is a NoneType object, it'll raise this TypeError
    try:
        return jsonify({'predicted_tweet': request.json['content']})
    except TypeError:
        abort(404)


if __name__ == '__main__':
    app.run(debug=True, port=1337)

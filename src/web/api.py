from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import os
import sys
import numpy as np
from keras.models import load_model
from keras import backend as K
import tensorflow as tf
import json


models = None
graph = None


"""
    Function that returns the names of the index_word,
    word_index and .h5 files.

    Parameters: modelFiles -> a list of strings
                              with the files in a certain folder
    Return: index_word, word_index, .h5 file names
"""


def filterAndReturnNames(modelFiles):
    index_word = list(filter(lambda x: ('index_word' in x), modelFiles))
    index_word = index_word[0] if len(index_word) else index_word

    word_index = list(filter(lambda x: ('word_index' in x), modelFiles))
    word_index = word_index[0] if len(word_index) else word_index

    modelPath = list(filter(lambda x: ('.h5' in x), modelFiles))
    modelPath = modelPath[0] if len(modelPath) else modelPath
    return index_word, word_index, modelPath


"""
    Function responsible for loading our models from a given path
"""


def loadModels(path):

    modelsDict = {
        'bras_cubas':
        {'40': {
            'generator': '',
            'word_index': '',
            'index_word': ''

        },
            '80': {
            'generator': '',
            'word_index': '',
            'index_word': ''
        }
        },
        'biblia': {
            '40': {
                'generator': '',
                'word_index': '',
                'index_word': ''
            },
            '80': {
                'generator': '',
                'word_index': '',
                'index_word': ''
            }
        }
    }
    model = {
        '40': {
            'generator': '',
            'word_index': '',
            'index_word': ''
        },
        '80': {
            'generator': '',
            'word_index': '',
            'index_word': ''
        }
    }

    print(">>> Loading './models/bras_cubas_novo/40chars/'")
    global graph
    graph = tf.get_default_graph()
    modelsDict['bras_cubas']['40']['generator'] = load_model(
        './models/bras_cubas_novo/40chars/bras_cubas_40-keras_model.h5')
    modelsDict['bras_cubas']['40']['word_index'] = json.load(
        open('./models/bras_cubas_novo/40chars/bras_cubas_40-word_index.json'))
    modelsDict['bras_cubas']['40']['index_word'] = json.load(
        open('./models/bras_cubas_novo/40chars/bras_cubas_40-index_word.json'))

    print(">>> Loading './models/bras_cubas_novo/80chars/'")
    graph = tf.get_default_graph()
    modelsDict['bras_cubas']['80']['generator'] = load_model(
        './models/bras_cubas_novo/80chars/bras_cubas_80-keras_model.h5')
    modelsDict['bras_cubas']['80']['word_index'] = json.load(
        open('./models/bras_cubas_novo/80chars/bras_cubas_80-word_index.json'))
    modelsDict['bras_cubas']['80']['index_word'] = json.load(
        open('./models/bras_cubas_novo/80chars/bras_cubas_80-index_word.json'))

    print(">>> Loading ./models/biblia/40chars/")
    graph = tf.get_default_graph()
    modelsDict['biblia']['40']['generator'] = load_model(
        './models/biblia/40chars/biblia_40-keras_model.h5')
    modelsDict['biblia']['40']['word_index'] = json.load(
        open('./models/biblia/40chars/biblia_40-word_index.json'))
    modelsDict['biblia']['40']['index_word'] = json.load(
        open('./models/biblia/40chars/biblia_40-index_word.json'))

    print(">>> Loading ./models/biblia/80chars/")
    graph = tf.get_default_graph()
    modelsDict['biblia']['80']['generator'] = load_model(
        './models/biblia/80chars/biblia_80-keras_model.h5')
    modelsDict['biblia']['80']['word_index'] = json.load(
        open('./models/biblia/80chars/biblia_80-word_index.json'))
    modelsDict['biblia']['80']['index_word'] = json.load(
        open('./models/biblia/80chars/biblia_80-index_word.json'))

    print(">>> Models loaded!")

    global models
    models = modelsDict


"""
    Function that generates our text sequence
    Parameters: model -> dictionary of models created on the beginning
                currentModel -> name of our model, the key of the dictionary
                instance -> 80 or 40 length char sequence
    Return values: next_seq -> sequence of chars that have been inferred
"""


def generateTextSeq(version, currentModel, instance):
    print(f"Generating a {version} {currentModel} from {instance}")
    global graph
    with graph.as_default():
        # Reshaping our instance to pass it in the right dimensions to the network.
        instanceList = list(instance)
        testInstance = list(
            map(
                lambda x: models[currentModel][version]['word_index'].get(
                    x, 0),
                instanceList))

        curr = np.array(testInstance).copy().reshape((1, -1))

        next_seq = []

        blank_count = 0

        # While our network hasn't predicted three spaces.
        while blank_count < 3:

            # inferring the next char and translating it with our tokenizer
            _next = models[currentModel][version]['generator'].predict_classes(curr)[
                0]
            next_char = models[currentModel][version]['index_word'][str(_next)]

            # Updating the stop condition...
            if next_char == ' ':
                blank_count += 1

            next_seq.append(next_char)

            # Updating the 'last char' of our sequence to keep predicting...
            curr[0, 0: -1] = curr[0, 1:]
            curr[0, -1] = _next

        return ''.join(next_seq)


app = Flask(__name__)
CORS(app)  # Defining CORS for the localhost domain...


def init(path):
    loadModels(path)


"""
    Responsible for defining the single method of the api.
    This will make the predictions possible by serving a tensorflow instance.
"""
@app.route('/', methods=['POST'])
def predict():
    content = request.json['content']
    version = request.json['version']
    currModel = request.json['model']
    inputSize = models[currModel][version]['generator'].input_shape[1]

    if (len(content) < inputSize):
        return jsonify({'predicted_tweet': content})
    else:

        generated_tweet = generateTextSeq(
            version,
            currModel,
            content[-inputSize:])
        print(">>> Generated_tweet", generated_tweet)
        try:
            return jsonify({'predicted_tweet': content + generated_tweet})
        except TypeError:
            # In case our request.json is a NoneType object,
            # it'll raise this TypeError
            abort(404)


if __name__ == '__main__':
    loadModels(sys.argv[1])

    app.run(debug=True, port=1337, threaded=True)
    del models

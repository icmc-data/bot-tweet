"""
    This file was created to be used as a test playground to other funcions
    that we needed to develop.

    These functions may not work, since they may or not be in the project
    functioning version.

    You should treat this file as a original developers oriented file.
"""


def loadModels(path):
    global models

    K.clear_session()
    modelsPath = os.listdir(path)

    # Taking out '.gitkeep' file...
    modelsPath = list(filter(lambda x: x != '.gitkeep', modelsPath))

    modelsDict = {}
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

    # This loop acesses each child-folder of '/models' folder
    for i in modelsPath:

        # Taking the names of all files in the current folder.
        fortyChars = path + '/' + i + '/40chars'
        eightyChars = path + '/' + i + '/80chars'

        # Name of our current folder
        modelName = i

        # Names of the files in 40 and 80 chars folders, respectively
        fortyModelFiles = os.listdir(fortyChars)
        eightyModelFiles = os.listdir(eightyChars)

        # Finding the names we'll need when loading the 40 and 80 chars model.
        fortyIndexWordFileName, fortyWordIndexFileName, fortyModelPath = filterAndReturnNames(
            fortyModelFiles)

        eightyIndexWordFileName, eightyWordIndexFileName, eightyModelPath = filterAndReturnNames(
            eightyModelFiles)

        # The next lines load all the files from the 40 chars model folder.
        print(f">>> Loading {fortyModelPath}")
        model['40']['generator'] = load_model(
            fortyChars + '/' + fortyModelPath)
        global graph
        graph = tf.get_default_graph()

        with open(fortyChars + '/' + fortyIndexWordFileName) as f:
            model['40']['index_word'] = json.load(f)

        with open(fortyChars + '/' + fortyWordIndexFileName) as f:
            model['40']['word_index'] = json.load(f)

        # The next lines load all the files from the 80 chars model folder.
        # We use a 'try except' block, since not all models
        # have a 80 chars version.
        try:
            print(f">>> Loading {eightyModelPath}")
            model['80']['generator'] = load_model(
                eightyChars + '/' + eightyModelPath)
            graph = tf.get_default_graph()

            with open(eightyChars + '/' + eightyIndexWordFileName) as f:
                model['80']['index_word'] = json.load(f)

            with open(eightyChars + '/' + eightyWordIndexFileName) as f:
                model['80']['word_index'] = json.load(f)
        except TypeError:
            print(f">>> Couldn't load model '{eightyChars}'")

        modelsDict[modelName] = model

    models = modelsDict
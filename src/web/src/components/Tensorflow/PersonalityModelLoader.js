import * as tf from "@tensorflow/tfjs";


class PersonalityModelLoader {

    constructor(tokenizerWordIndex, tokenizerIndexWord, modelPath){
        this.tokenizerWordIndex = tokenizerWordIndex;
        this.tokenizerIndexWord = tokenizerIndexWord;
        this.modelPath = modelPath;
        this.model = this.loadModel(this.modelPath);
    }

    async loadModel (modelPath){

        let model = null;

        // try {
            model = await tf.loadLayersModel(modelPath)
        // } catch (error) {
            console.log("Couldn't load your model. Please, verify informed path.");
        // }

        return model;

    }

    tokenize_Word_Index(word) {
        let a = []

        for(let i of word){
            a.push(this.tokenize_Word_Index[i])
        }

        return a;
    }

    tokenize_Index_Word(index){
        let a = []

        for(let i of index){
            a.push(this.tokenize_Index_Word[i])
        }

        return a;
    }
}

export default PersonalityModelLoader;
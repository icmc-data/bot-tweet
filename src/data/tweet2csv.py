import os
import pandas

twitterName = 'revistasuper'
tweetFilesList = os.listdir('./' + twitterName)

sentences = []

for i in tweetFilesList:
    with open('./' + twitterName + '/' + i) as file:

        for j in file.readlines():
            curSentences = j.strip('\n')

            if (curSentences == '' or curSentences == ' '):
                continue

            sentences.append(curSentences)


df = pandas.DataFrame(sentences, columns=['Sentences'])
df.dropna(axis=0, how='any', thresh=None, subset=None, inplace=False)


df.to_csv(f'{twitterName}.csv')

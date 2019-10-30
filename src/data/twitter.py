import tweepy as tw
import os
from dotenv import load_dotenv
import time
import pandas as pd
from bs4 import BeautifulSoup
import requests


"""
    Preparing our global variables to be used in the functions defined below
"""
load_dotenv(verbose=True)
# Here we'll load all api keys (shhh, these must remain a secret...)
ACCOUNT_TYPE = os.getenv("ACCOUNT_TYPE")
ENDPOINT = os.getenv("ENDPOINT")
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

# Accessing our developer account. We need this to access the api services
auth = tw.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

# The api instantiation we'll use 'til the end of the script.
api = tw.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

numberOfTweetsMined = 0
numberOfUrls = 0
truncatedAndUrl = 0
truncated = 0
requested = 0


"""
    Function responsible to mine the timeline of a specific user id.
"""


def MineTimelineData(idToMine):

    global numberOfTweetsMined
    global numberOfUrls
    global truncatedAndUrl
    global truncated
    global requested

    # Setting up tweepy...
    cursor = tw.Cursor(api.user_timeline, id=idToMine)

    # Creating a folder to store our scrapped dataset...
    if not os.path.exists(str(idToMine)):
        os.makedirs(str(idToMine))
        os.makedirs(str(idToMine) + '/apiData')
        os.makedirs(str(idToMine) + '/scrappedData')

    # This is an (almost) infinite loop. It through all tweets of a user.
    while(tw.Cursor(api.user_timeline).items()):
        print(">>> Mining tweets... please wait...")

        # At some point, we will run out of requests to the api...
        # ...when it happens, it will trigger an error...
        # ...that will be handled by this 'Try' block.
        try:
            for page in cursor.pages():
                for tweet in page:
                    requested += 1

                    # pp = pprint.PrettyPrinter(indent=4)
                    # pp.pprint(tweet)

                    # Skipping quoted_tweets, retweets and replies...
                    try:
                        print("Retweet?", tweet.retweeted)
                        print("Quote?", tweet.in_reply_to_user_id)
                        print("Reply?", tweet.is_quote_status)

                        if (tweet.retweeted is True or
                            tweet.in_reply_to_user_id is not None or
                                tweet.is_quote_status is True or
                                tweet.text[:2] == "RT"):
                            continue

                    except AttributeError:
                        pass

                    # We'll test if all truncated tweets
                    # end in it's respective URL...
                    if (tweet._json['truncated'] is True and
                            len(tweet._json['entities']['urls']) != 0):
                        truncatedAndUrl += 1

                    if (tweet._json['truncated'] is True):
                        truncated += 1

                    # If our tweet has a url in
                    # which it can be scrapped
                    # we'll request this html
                    # file and scrape here inside...
                    if (len(tweet._json['entities']['urls']) != 0 and
                            tweet._json['truncated'] is True):
                        numberOfUrls += 1

                        # Requesting our HTML file from twitter.com
                        tweetLink = tweet._json['entities']['urls'][0]['url']
                        soup = BeautifulSoup(requests.get(
                            tweetLink).content, 'html.parser')

                        # Finding the exact element
                        # that holds the text of a tweet.
                        p = soup.find(
                            "p", {
                                "class": "TweetTextSize TweetTextSize--jumbo \
                                    js-tweet-text tweet-text"})

                        # Some tweets will only have an image, so there'll
                        # happen an error when 'p.get_text() is called...
                        try:
                            print("Tweet:", p.get_text())

                            # Writing the decoded text to a file
                            # with the id of the tweet
                            with open(str(idToMine) +
                                      '/' +
                                      str(tweet.id),
                                      "w+") as f:
                                f.writelines(p.get_text())
                                numberOfTweetsMined = numberOfTweetsMined + 1
                                print("Mined tweet: " +
                                      tweet.text[:40] + '...')

                        except AttributeError:
                            pass

                    else:

                        # Writing the text we've got from the twitter API...
                        with open(str(idToMine) +
                                  '/' +
                                  str(tweet.id),
                                  "w+") as f:
                            f.writelines(tweet.text)
                            numberOfTweetsMined = numberOfTweetsMined + 1
                            print(
                                "Mined tweet: " + tweet.text[:40] + '...' +
                                "\t Created at " + str(tweet.created_at))

        except tw.RateLimitError:
            print("Rate limit reached! Waiting 15 minutes...",
                  "Until now, we've mined " + str(numberOfTweetsMined))
            time.sleep(60 * 15)  # wait 15 minutes (900 seconds)


if __name__ == '__main__':
    try:
        minedDataFrame = pd.DataFrame(
            columns=["Tweet Text", "Tweet Created On"])

        user = api.get_user('justinBieber')

        MineTimelineData(user.id)
    except KeyboardInterrupt:

        print(
            f"\n \n \n Finished Mining Tweets! You've mined \
                {numberOfTweetsMined} tweets!")

        print(
            f"\n \n \n Urls Mined \
                {numberOfUrls} tweets!")

        print(f'{numberOfUrls/numberOfTweetsMined * 100}% of the \
                generated Dataset came from scrapped data.')

        print(
            f'Number of tweets that have a url and are truncated : \
                {truncatedAndUrl} ')

        print(f'Number of tweets that are truncated : {truncated} ')

        print(f'Number of requested tweets : {requested} ')
